import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Heart, Sparkles, BookOpen, Share2, Users, ArrowRight, Clock, Star, X, Loader2, RefreshCw, Search } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateRecipeImage, searchTrendingRecipes, getAIStatus, resolveCleanRecipeImage } from '@/lib/gemini';
import { ALL_TRENDING_RECIPES, TrendingRecipe } from '@/lib/recipePool';
import { Input } from '@/components/ui/input';

interface LandingPageProps {
  onViewDiscover: () => void;
}

export function LandingPage({ onViewDiscover }: LandingPageProps) {
  const { signIn } = useAuth();
  const trendingRef = useRef<HTMLDivElement>(null);
  const [allRecipes, setAllRecipes] = useState<TrendingRecipe[]>(ALL_TRENDING_RECIPES);
  const [visibleRecipes, setVisibleRecipes] = useState<TrendingRecipe[]>(ALL_TRENDING_RECIPES.slice(0, 3));
  const [previewRecipe, setPreviewRecipe] = useState<TrendingRecipe | null>(null);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [aiStatus, setAiStatus] = useState(getAIStatus());
  const imageCache = useRef<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setAiStatus(getAIStatus());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTrending = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchTrendingRecipes(searchQuery, allRecipes);
      if (results.length > 0) {
        setVisibleRecipes(results);
        generateVisibleImages(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const generateVisibleImages = async (recipes: TrendingRecipe[]) => {
    const status = getAIStatus();
    if (status.isLimited) return;

    // Track which IDs are currently being enhanced
    const idsToEnhance = recipes
      .filter(r => !imageCache.current[r.id] && !r.image.startsWith('data:'))
      .map(r => r.id);
    
    setGeneratingIds(new Set(idsToEnhance));

    const updatedRecipes = await Promise.all(
      recipes.map(async (recipe, index) => {
        if (imageCache.current[recipe.id]) {
          return { ...recipe, image: imageCache.current[recipe.id] };
        }
        
        if (recipe.image.startsWith('data:')) {
          return recipe;
        }

        await new Promise(resolve => setTimeout(resolve, index * 400));

        try {
          const aiImage = await generateRecipeImage(recipe.title, recipe.ingredients.join(', '));
          if (aiImage && aiImage.startsWith('data:')) {
            imageCache.current[recipe.id] = aiImage;
            // Update the specific recipe in the visible list immediately
            setVisibleRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, image: aiImage } : r));
            setGeneratingIds(prev => {
              const next = new Set(prev);
              next.delete(recipe.id);
              return next;
            });
            return { ...recipe, image: aiImage };
          }
          return recipe;
        } catch (error) {
          return recipe;
        }
      })
    );
    
    setAllRecipes(prev => prev.map(r => {
      const updated = updatedRecipes.find(ur => ur.id === r.id);
      return updated || r;
    }));
    
    setGeneratingIds(new Set());
  };

  const shuffleRecipes = async () => {
    setIsShuffling(true);
    setSearchQuery(""); // Clear search on shuffle
    // Artificial delay to make the "AI update" feel more substantial
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    const nextSet = shuffled.slice(0, 3);
    setVisibleRecipes(nextSet);
    setIsShuffling(false);
    
    // Trigger generation for the new set if needed
    generateVisibleImages(nextSet);
  };

  useEffect(() => {
    generateVisibleImages(visibleRecipes);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50/30 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Welcome to The Pink Apron</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-gray-900 leading-[0.9] tracking-tight">
                  Where Every <span className="text-pink-500 italic">Recipe</span> Tells a Story.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-500 font-light max-w-2xl leading-relaxed">
                  Your personal digital sanctuary for culinary inspiration. Save, organize, and share your favorite meals in a space designed with love.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Button 
                  size="lg" 
                  onClick={signIn}
                  className="h-14 px-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold shadow-xl shadow-pink-200 group"
                >
                  Join the Kitchen
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={scrollToTrending}
                  className="h-14 px-8 rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 text-lg font-bold"
                >
                  Explore Recipes
                </Button>
              </motion.div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-pink-200 rounded-[3rem] rotate-6 scale-105 opacity-50 blur-2xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Cooking with love"
                    className="w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-pink-50 hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white">
                        <Heart className="h-6 w-6 fill-current" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">1,000+ Recipes</p>
                        <p className="text-xs text-gray-500">Shared with love</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-pink-300/10 rounded-full blur-3xl" />
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Our Mission</h2>
              <div className="h-1 w-24 bg-pink-500 mx-auto rounded-full" />
            </div>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed italic">
              "We believe that the kitchen is the heart of the home, and every recipe is a love letter to those we care about. The Pink Apron was born from a desire to create a beautiful, simple space where culinary memories are preserved and shared."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
              <div className="space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Digital Cookbook</h3>
                <p className="text-gray-500 font-light">Organize your recipes in a beautiful, searchable digital library that goes wherever you do.</p>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Share2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Easy Sharing</h3>
                <p className="text-gray-500 font-light">Share your favorite creations with friends and family with just a single click or a simple link.</p>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Community</h3>
                <p className="text-gray-500 font-light">Join a community of food lovers who believe that cooking should be as beautiful as it is delicious.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop" 
                  alt="Baking"
                  className="w-full h-64 object-cover rounded-3xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Healthy food"
                  className="w-full h-64 object-cover rounded-3xl shadow-lg mt-8"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Smart Features for the <span className="text-pink-500">Modern</span> Chef
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "AI Recipe Import", desc: "Paste any URL and our AI will instantly extract the ingredients and steps for you." },
                  { title: "Smart Categorization", desc: "Your recipes are automatically organized into Breakfast, Lunch, Dinner, and more." },
                  { title: "Beautiful Printing", desc: "Print your recipes in a clean, elegant format that looks great in any kitchen." },
                  { title: "Mobile Friendly", desc: "Access your cookbook on your phone while you shop or cook." }
                ].map((feature, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-pink-500 flex-shrink-0 mt-1 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-500 font-light">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section ref={trendingRef} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Trending Now</h2>
                <p className="text-gray-500 font-light">
                  Explore our curated collection of <span className="text-pink-500 font-medium">50+ signature recipes</span>. Use our AI search to find exactly what you're craving.
                </p>
              </div>
              
              <form onSubmit={handleAISearch} className="relative group max-w-md w-full">
                <Input
                  type="text"
                  placeholder="Ask AI: 'Something pink and sweet' or 'Healthy dinner'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-32 rounded-2xl border-pink-100 focus:border-pink-300 focus:ring-pink-200 bg-pink-50/30 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
                <Button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 h-10 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold px-4 shadow-lg shadow-pink-100"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "AI Search"}
                </Button>
              </form>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Button 
                variant="outline" 
                onClick={shuffleRecipes}
                disabled={isShuffling || isSearching}
                className="rounded-full border-pink-100 text-pink-500 hover:bg-pink-50 gap-2 h-12 px-8 shadow-sm transition-all hover:shadow-md active:scale-95"
              >
                <RefreshCw className={`h-4 w-4 ${isShuffling ? 'animate-spin' : ''}`} />
                Next Recipes
              </Button>
              {aiStatus.isLimited && (
                <div className="space-y-1">
                  <p className="text-[10px] text-pink-400 font-medium animate-pulse">
                    AI is resting... back in {aiStatus.resetIn}s
                  </p>
                  <p className="text-[9px] text-gray-400 max-w-[200px]">
                    Alternative: Try our <span className="text-pink-300 font-bold">50+ pre-loaded recipes</span> or manual search while AI recovers.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <AnimatePresence mode="wait">
              {isShuffling || isSearching ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full h-[400px] flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-pink-500 animate-pulse" />
                  </div>
                  <p className="text-pink-500 font-medium animate-pulse">
                    {isSearching ? "AI is finding the perfect recipes..." : "AI is curating new recipes..."}
                  </p>
                </motion.div>
              ) : (
                <>
                  {visibleRecipes.map((recipe, i) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => setPreviewRecipe(recipe)}
                    >
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl mb-6">
                        <img 
                          src={resolveCleanRecipeImage({ imageUrl: recipe.image, title: recipe.title, category: recipe.category })} 
                          alt={recipe.title}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${generatingIds.has(recipe.id) ? 'brightness-75 blur-[2px]' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        {generatingIds.has(recipe.id) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px]">
                            <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin mb-2" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-widest drop-shadow-md">AI Enhancing...</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="px-3 py-1 rounded-full bg-white/90 text-pink-600 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            {recipe.category}
                          </span>
                          {recipe.image.startsWith('data:') && (
                            <div className="px-2 py-1 rounded-full bg-pink-500/80 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-tighter flex items-center gap-1 w-fit">
                              <Sparkles className="h-2 w-2" />
                              AI Style
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-pink-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-bold">{recipe.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{recipe.time}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-pink-500 transition-colors">
                          {recipe.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full flex justify-center mt-12"
                  >
                    <Button 
                      onClick={onViewDiscover}
                      className="h-14 px-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-xl shadow-pink-100 group"
                    >
                      View All 50+ Recipes
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Recipe Preview Dialog */}
      <Dialog open={!!previewRecipe} onOpenChange={(open) => !open && setPreviewRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-0 border-none shadow-2xl">
          {previewRecipe && (
            <div className="flex flex-col">
              <div className="relative h-64 md:h-80">
                <img 
                  src={resolveCleanRecipeImage({ imageUrl: previewRecipe.image, title: previewRecipe.title, category: previewRecipe.category })} 
                  alt={previewRecipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest">
                      {previewRecipe.category}
                    </span>
                    <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      {previewRecipe.time}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                    {previewRecipe.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-pink-500">
                      <Utensils className="h-5 w-5" />
                      <h3 className="text-xl font-serif font-bold text-gray-900">Ingredients</h3>
                    </div>
                    <ul className="space-y-4">
                      {previewRecipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-600 font-light">
                          <div className="h-1.5 w-1.5 rounded-full bg-pink-300 mt-2 flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-pink-500">
                      <BookOpen className="h-5 w-5" />
                      <h3 className="text-xl font-serif font-bold text-gray-900">Instructions</h3>
                    </div>
                    <ol className="space-y-6">
                      {previewRecipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-50 text-pink-500 text-xs font-bold flex items-center justify-center border border-pink-100">
                            {idx + 1}
                          </span>
                          <p className="text-gray-600 font-light leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-8 border-t border-pink-50 text-center">
                  <p className="text-gray-500 mb-6 italic">Want to save this recipe to your personal collection?</p>
                  <Button 
                    onClick={() => {
                      setPreviewRecipe(null);
                      signIn();
                    }}
                    className="h-12 px-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-100"
                  >
                    Join The Pink Apron to Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Final CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900">Ready to Start Your Culinary Journey?</h2>
            <p className="text-xl text-gray-500 font-light">Join thousands of home chefs who have found their digital home at The Pink Apron.</p>
            <Button 
              size="lg" 
              onClick={signIn}
              className="h-16 px-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold shadow-2xl shadow-pink-200"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-50/50 -z-10 blur-3xl rounded-full scale-150" />
      </section>
    </div>
  );
}
