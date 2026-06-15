import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/useAuth';
import { useRecipes, Recipe, toggleFavorite } from '@/lib/useRecipes';
import { Navbar } from '@/components/Navbar';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeDetail } from '@/components/RecipeDetail';
import { CategoryFilter } from '@/components/CategoryFilter';
import { LandingPage } from '@/components/LandingPage';
import { GroceryList } from '@/components/GroceryList';
import { ALL_TRENDING_RECIPES, TrendingRecipe } from '@/lib/recipePool';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Utensils, Loader2, Heart, AlertTriangle, Plus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { db, deleteDoc, doc, OperationType, handleFirestoreError, collection, query, where, getDocs, limit, addDoc, serverTimestamp, orderBy } from '@/lib/firebase';
import { generateBatchRecipes } from '@/services/aiService';
import { generateRecipeImage } from '@/lib/gemini';
import { useRef, useCallback } from 'react';

function RecipeApp() {
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState('All');
  const [viewUserId, setViewUserId] = useState<string | undefined>(undefined);
  const [isDiscoverMode, setIsDiscoverMode] = useState(false);
  const { recipes, loading: recipesLoading, loadingMore, hasMore, loadMore } = useRecipes(category, viewUserId, 6);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  const [isCommunityMode, setIsCommunityMode] = useState(false);
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);
  const [isGroceryListMode, setIsGroceryListMode] = useState(false);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Discover recipes rotation logic
  const [visibleDiscoverCount, setVisibleDiscoverCount] = useState(8);
  const DISCOVER_INCREMENT = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDiscoverCount(prev => Math.min(prev + DISCOVER_INCREMENT, ALL_TRENDING_RECIPES.length));
      toast.info('New discover recipes added!');
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  // Image preloading for discover section
  useEffect(() => {
    if (isDiscoverMode) {
      const recipesToPreload = ALL_TRENDING_RECIPES.slice(0, visibleDiscoverCount);
      recipesToPreload.forEach(recipe => {
        const img = new Image();
        img.src = recipe.image;
      });
    }
  }, [isDiscoverMode, visibleDiscoverCount]);

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRecipeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (recipesLoading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isDiscoverMode && !isFavoritesMode) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [recipesLoading, loadingMore, hasMore, isDiscoverMode, isFavoritesMode, loadMore]);

  const activeView = isGroceryListMode
    ? 'grocery-list'
    : isDiscoverMode 
      ? 'discover' 
      : isFavoritesMode
        ? 'favorites'
        : viewUserId === user?.uid && user 
          ? 'my-recipes' 
          : isCommunityMode || (user && viewUserId === undefined)
            ? 'community'
            : 'landing';

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (recipe.authorId === 'system') {
      setLocalFavorites(prev => {
        const next = new Set(prev);
        if (next.has(recipe.id)) {
          next.delete(recipe.id);
          toast.success('Removed from favorites');
        } else {
          next.add(recipe.id);
          toast.success('Added to favorites');
        }
        return next;
      });
    } else {
      try {
        await toggleFavorite(recipe.id, !!recipe.isFavorite);
        toast.success(recipe.isFavorite ? 'Removed from favorites' : 'Added to favorites');
      } catch (error) {
        // Error handled in toggleFavorite
      }
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'recipes', recipeToDelete.id));
      toast.success('Recipe deleted successfully');
      setRecipeToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'recipes');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle direct recipe link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('recipe');
    if (recipeId && recipes.length > 0) {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) setSelectedRecipe(recipe);
    }
  }, [recipes]);

  const mapTrendingToRecipe = (tr: TrendingRecipe): Recipe => ({
    id: tr.id,
    title: tr.title,
    description: `${tr.time} • ${tr.rating} rating`,
    ingredients: tr.ingredients,
    instructions: tr.instructions,
    category: tr.category,
    tags: [tr.category, 'Trending'],
    authorId: 'system',
    authorName: 'The Pink Apron',
    isPublic: true,
    isFavorite: localFavorites.has(tr.id),
    imageUrl: tr.image,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const displayRecipes = isDiscoverMode 
    ? [...aiRecipes, ...ALL_TRENDING_RECIPES.map(mapTrendingToRecipe)]
    : recipes;

  const filteredRecipes = displayRecipes.filter(r => {
    // Categorize correctly and query properly under Discover mode matching category selections
    const matchesCategory = !isDiscoverMode || category === 'All' || 
      r.category.toLowerCase().trim() === category.toLowerCase().trim() ||
      (category.toLowerCase().trim() === 'snack' && r.category.toLowerCase().trim() === 'snacks') ||
      (category.toLowerCase().trim() === 'drink' && r.category.toLowerCase().trim() === 'drinks');

    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (isFavoritesMode) {
      return matchesCategory && matchesSearch && r.isFavorite;
    }
    return matchesCategory && matchesSearch;
  });

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleImportRecipe = (recipe: Recipe) => {
    const importedRecipe = {
      ...recipe,
      id: '', // New ID will be generated
      authorId: user?.uid || '',
      authorName: user?.displayName || 'Anonymous',
      isPublic: false, // Default to private when importing
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEditingRecipe(importedRecipe as Recipe);
    setIsFormOpen(true);
  };

  const handleShare = (recipe: Recipe) => {
    const url = window.location.origin + '?recipe=' + recipe.id;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const viewMyRecipes = () => {
    if (user) {
      setViewUserId(user.uid);
      setCategory('All');
      setIsDiscoverMode(false);
      setIsCommunityMode(false);
      setIsFavoritesMode(false);
      setIsGroceryListMode(false);
    }
  };

  const viewAllRecipes = () => {
    setViewUserId(undefined);
    setCategory('All');
    setIsDiscoverMode(false);
    setIsCommunityMode(true);
    setIsFavoritesMode(false);
    setIsGroceryListMode(false);
  };

  const viewDiscover = () => {
    setIsDiscoverMode(true);
    setCategory('All');
    setIsCommunityMode(false);
    setIsFavoritesMode(false);
    setIsGroceryListMode(false);
    
    // Trigger daily seeding if needed
    if (aiRecipes.length === 0) {
      seedDailyRecipes();
    }
  };

  const seedDailyRecipes = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      // Query ALL previously generated recipes stored permanently in 'ai_discover_recipes' sorted by newest
      const q = query(collection(db, 'ai_discover_recipes'), orderBy('createdAt', 'desc'), limit(150));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        if (!user) {
          toast.info('Sign in to unlock fresh daily AI recipes! Showing featured trending recipes for now.');
          setIsGenerating(false);
          return;
        }
        toast.info('Generating beautiful, mouthwatering recipes with related images... This will take a moment.');
        const allNewRecipes: Recipe[] = [];
        const today = new Date().toISOString().split('T')[0];
        
        // Generate 20 high-quality recipes in 2 batches of 10
        for (let i = 0; i < 2; i++) {
          const batch = await generateBatchRecipes(10);
          const batchPromises = batch.map(async (recipeData) => {
            // Categorize correctly: map category string to valid UI categories
            // 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'
            let mappedCategory = 'Other';
            const catLower = recipeData.category.toLowerCase().trim();
            if (catLower.includes('breakfast')) mappedCategory = 'Breakfast';
            else if (catLower.includes('lunch')) mappedCategory = 'Lunch';
            else if (catLower.includes('dinner')) mappedCategory = 'Dinner';
            else if (catLower.includes('dessert')) mappedCategory = 'Dessert';
            else if (catLower.includes('snack')) mappedCategory = 'Snack';
            else if (catLower.includes('drink')) mappedCategory = 'Drink';

            recipeData.category = mappedCategory;

            // Generate beautifully matching real-life related images
            const imageUrl = await generateRecipeImage(recipeData.title, recipeData.description || mappedCategory);

            const docData = {
              ...recipeData,
              authorId: 'system',
              authorName: 'The Pink Apron AI',
              isPublic: true,
              generatedDate: today,
              likedBy: [],
              likesCount: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              averageRating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
              totalRatings: Math.floor(Math.random() * 25) + 5,
              imageUrl: imageUrl
            };

            const docRef = await addDoc(collection(db, 'ai_discover_recipes'), docData);
            return { 
              id: docRef.id, 
              ...recipeData, 
              imageUrl, 
              authorId: 'system',
              authorName: 'The Pink Apron AI',
              isPublic: true,
              likedBy: [],
              likesCount: 0,
              averageRating: docData.averageRating,
              totalRatings: docData.totalRatings,
              createdAt: new Date(),
              updatedAt: new Date()
            } as unknown as Recipe;
          });
          const results = await Promise.all(batchPromises);
          allNewRecipes.push(...results);
          toast.info(`Progress: ${(i + 1) * 50}%`);
        }
        setAiRecipes(allNewRecipes);
        toast.success('Beautiful, persistent recipes initialized!');
      } else {
        const existing = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
          updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date()
        })) as unknown as Recipe[];
        setAiRecipes(existing);
      }
    } catch (error) {
      console.error('Failed to seed recipes:', error);
      toast.error('Failed to load or generate daily recipes.');
    } finally {
      setIsGenerating(false);
    }
  };

  const viewFavorites = () => {
    setIsFavoritesMode(true);
    setIsDiscoverMode(false);
    setIsCommunityMode(false);
    setIsGroceryListMode(false);
    setViewUserId(undefined);
    setCategory('All');
  };

  const viewGroceryList = () => {
    setIsGroceryListMode(true);
    setIsDiscoverMode(false);
    setIsCommunityMode(false);
    setIsFavoritesMode(false);
    setViewUserId(undefined);
  };

  const viewHome = () => {
    setViewUserId(undefined);
    setCategory('All');
    setIsDiscoverMode(false);
    setIsCommunityMode(false);
    setIsFavoritesMode(false);
    setIsGroceryListMode(false);
    setSearchQuery('');
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-pink-50/30">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar 
        onAddRecipe={handleAddRecipe} 
        onViewMyRecipes={viewMyRecipes}
        onViewAllRecipes={viewAllRecipes}
        onViewDiscover={viewDiscover}
        onViewFavorites={viewFavorites}
        onViewGroceryList={viewGroceryList}
        onViewHome={viewHome}
        activeView={activeView}
      />
      
      {activeView === 'landing' && !user ? (
        <LandingPage onViewDiscover={viewDiscover} />
      ) : activeView === 'grocery-list' ? (
        <main className="container mx-auto px-4 py-8">
          <GroceryList />
        </main>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-2">
                Discover & Share <span className="text-pink-500 italic">Sweet</span> Moments
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                Your personal digital cookbook. Save your favorite meals, organize them with love, and share the joy of cooking with others.
              </p>
            </motion.div>

            {isCommunityMode && user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-4"
              >
                <Button 
                  onClick={handleAddRecipe}
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-6 h-auto text-lg font-bold shadow-xl shadow-pink-100 group"
                >
                  <Plus className="mr-2 h-6 w-6 group-hover:rotate-90 transition-transform" />
                  Post a Recipe
                </Button>
              </motion.div>
            )}

            <div className="max-w-xl mx-auto relative mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-300" />
              <Input 
                className="pl-10 h-12 rounded-full border-pink-100 focus-visible:ring-pink-400 shadow-sm bg-white"
                placeholder="Search recipes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8">
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>

          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-800">
                {isDiscoverMode 
                  ? 'Discover Favorites' 
                  : isFavoritesMode 
                    ? 'My Favorites' 
                    : isCommunityMode
                      ? 'Community Feed'
                      : viewUserId 
                        ? 'My Collection' 
                        : category === 'All' 
                          ? 'Latest Creations' 
                          : `${category} Recipes`}
              </h2>
            <p className="text-sm text-pink-400 font-medium">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>

          {recipesLoading && !isDiscoverMode ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="space-y-12">
              <div className={`grid gap-8 ${isCommunityMode ? 'max-w-xl mx-auto grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                <AnimatePresence mode="popLayout">
                  {filteredRecipes.map((recipe, index) => (
                    <div 
                      key={recipe.id} 
                      ref={index === filteredRecipes.length - 1 ? lastRecipeElementRef : null}
                    >
                      <RecipeCard 
                        recipe={recipe} 
                        currentUserId={user?.uid}
                        onClick={setSelectedRecipe}
                        onShare={handleShare}
                        onDelete={setRecipeToDelete}
                        onToggleFavorite={handleToggleFavorite}
                        onImport={handleImportRecipe}
                        isCommunityView={isCommunityMode}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button & Status */}
              {!isDiscoverMode && !isFavoritesMode && (
                <div className="flex flex-col items-center justify-center pt-8 pb-12">
                  {loadingMore ? (
                    <div className="flex items-center gap-3 text-pink-500 font-medium">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading more deliciousness...</span>
                    </div>
                  ) : hasMore ? (
                    <Button 
                      onClick={loadMore}
                      variant="outline"
                      className="rounded-full px-8 py-6 border-pink-200 text-pink-500 hover:bg-pink-50 hover:text-pink-600 font-bold group"
                    >
                      <ChevronDown className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                      Load More Recipes
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <div className="h-px w-24 bg-gray-200" />
                      <p className="text-sm italic">You've reached the end of the apron strings!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 bg-white/80 rounded-3xl border-2 border-dashed border-pink-100">
              <Utensils className="h-12 w-12 text-pink-200" />
              <div>
                <p className="text-xl font-medium text-gray-400">No recipes found</p>
                <p className="text-sm text-gray-300">Try a different search or category</p>
              </div>
              {user && (
                <Button onClick={handleAddRecipe} variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full">
                  Add your first recipe
                </Button>
              )}
            </div>
          )}
        </main>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent 
          showCloseButton={false}
          className="max-w-6xl w-[98vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white flex flex-col"
        >
          {selectedRecipe && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedRecipe.title}</DialogTitle>
                <DialogDescription>{selectedRecipe.description}</DialogDescription>
              </DialogHeader>
              <RecipeDetail 
                recipe={selectedRecipe} 
                onEdit={(recipe) => {
                  setSelectedRecipe(null);
                  handleEditRecipe(recipe);
                }}
                onClose={() => setSelectedRecipe(null)}
                onToggleFavorite={handleToggleFavorite}
                onImport={(recipe) => {
                  setSelectedRecipe(null);
                  handleImportRecipe(recipe);
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Recipe Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </DialogTitle>
          </DialogHeader>
          <RecipeForm 
            recipe={editingRecipe || undefined} 
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Grid-level Delete Confirmation Dialog */}
      <Dialog open={!!recipeToDelete} onOpenChange={(open) => !open && setRecipeToDelete(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-none shadow-2xl bg-white">
          <DialogHeader className="items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-serif font-black text-gray-900">Delete Recipe?</DialogTitle>
            {recipeToDelete && (
              <DialogDescription className="text-gray-500 text-base">
                Are you sure you want to delete <span className="font-bold text-gray-900">"{recipeToDelete.title}"</span>? This action cannot be undone.
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 mt-8 sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setRecipeToDelete(null)}
              className="flex-1 rounded-full border-gray-200 text-gray-600 font-bold h-12"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRecipe}
              className="flex-1 rounded-full bg-red-500 hover:bg-red-600 font-bold h-12 shadow-lg shadow-red-100"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 font-serif text-xl font-bold text-primary">
            <Utensils className="h-6 w-6 text-pink-500" />
            <span>The Pink Apron</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Made with <Heart className="h-4 w-4 inline text-red-500 fill-red-500" /> for food lovers everywhere.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-pink-500">Privacy Policy</a>
            <a href="#" className="hover:text-pink-500">Terms of Service</a>
            <a href="#" className="hover:text-pink-500">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RecipeApp />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
