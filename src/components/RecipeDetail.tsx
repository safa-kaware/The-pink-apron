import { Recipe, toggleLike, submitRating } from '@/lib/useRecipes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Share2, Printer, Edit, Trash2, X, Calendar, User, Heart, AlertTriangle, ShoppingBasket, Plus, Check, MessageCircle, Send, ThumbsUp, Star } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useGroceryList } from '@/lib/useGroceryList';
import { rescaleRecipe, RescaledRecipeData } from '@/services/aiService';
import { db, deleteDoc, doc, OperationType, handleFirestoreError, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from '@/lib/firebase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Minus, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { resolveCleanRecipeImage } from '@/lib/gemini';

interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  createdAt: any;
}

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onClose: () => void;
  onToggleFavorite?: (recipe: Recipe) => void;
  onImport?: (recipe: Recipe) => void;
}

export function RecipeDetail({ recipe, onEdit, onClose, onToggleFavorite, onImport }: RecipeDetailProps) {
  const { user } = useAuth();
  const { addToGroceryList, removeFromGroceryList, isInGroceryList, groceryList } = useGroceryList();
  const isAuthor = user?.uid === recipe.authorId;
  const isSystem = recipe.authorId === 'system';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [servings, setServings] = useState(recipe.servings || 4);
  const [isRescaling, setIsRescaling] = useState(false);
  const [rescaledData, setRescaledData] = useState<RescaledRecipeData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const isLiked = user ? recipe.likedBy?.includes(user.uid) : false;

  useEffect(() => {
    if (!user || recipe.id.startsWith('trending')) return;
    const isDiscover = recipe.authorId === 'system';
    const collectionName = isDiscover ? 'ai_discover_recipes' : 'recipes';
    const unsubscribe = onSnapshot(doc(db, collectionName, recipe.id, 'ratings', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserRating(snapshot.data().rating);
      }
    });
    return () => unsubscribe();
  }, [recipe.id, user]);

  useEffect(() => {
    if (recipe.id.startsWith('trending')) return;
    const q = query(
      collection(db, 'recipes', recipe.id, 'comments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `recipes/${recipe.id}/comments`);
    });

    return () => unsubscribe();
  }, [recipe.id]);

  const handleToggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like recipes');
      return;
    }
    const isDiscover = recipe.authorId === 'system' && !recipe.id.startsWith('trending');
    const collectionName = isDiscover ? 'ai_discover_recipes' : 'recipes';
    await toggleLike(recipe.id, user.uid, !!isLiked, collectionName);
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please sign in to rate recipes');
      return;
    }
    setIsSubmittingRating(true);
    try {
      const isDiscover = recipe.authorId === 'system' && !recipe.id.startsWith('trending');
      const collectionName = isDiscover ? 'ai_discover_recipes' : 'recipes';
      await submitRating(recipe.id, user.uid, rating, recipe.averageRating, recipe.totalRatings, collectionName);
      toast.success('Rating submitted!');
    } catch (error) {
      // Error handled in submitRating
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, 'recipes', recipe.id, 'comments'), {
        text: newComment.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        createdAt: serverTimestamp()
      });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `recipes/${recipe.id}/comments`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const displayIngredients = rescaledData?.ingredients || recipe.ingredients;
  const displayInstructions = rescaledData?.instructions || recipe.instructions;
  const displayCookTime = rescaledData?.cookTime || recipe.cookTime || '25 Mins';

  const handleRescale = async (newServings: number) => {
    if (newServings < 1) return;
    setServings(newServings);
    setIsRescaling(true);
    try {
      const data = await rescaleRecipe(recipe, newServings);
      setRescaledData(data);
      toast.success(`Recipe rescaled for ${newServings} servings!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to rescale recipe with AI.');
    } finally {
      setIsRescaling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'recipes', recipe.id));
      toast.success('Recipe deleted successfully');
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'recipes');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + '?recipe=' + recipe.id;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header Actions */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {onToggleFavorite && (
          <Button 
            size="icon" 
            variant="secondary" 
            className={`rounded-full shadow-lg border transition-all duration-300 ${
              recipe.isFavorite 
                ? 'bg-pink-500 text-white hover:bg-pink-600 border-pink-600' 
                : 'bg-white/90 text-pink-500 hover:bg-white border-pink-50'
            }`}
            onClick={() => onToggleFavorite(recipe)}
          >
            <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
          </Button>
        )}
        {(!isAuthor || isSystem) && onImport && (
          <Button 
            variant="secondary" 
            className="rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 text-white border-none px-4 font-bold"
            onClick={() => onImport(recipe)}
          >
            Import to Collection
          </Button>
        )}
        {isAuthor && (
          <>
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-pink-600 border border-pink-50" onClick={() => onEdit(recipe)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive" className="rounded-full shadow-lg border border-red-100" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-pink-600 border border-pink-50" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-pink-600 border border-pink-50" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-none shadow-2xl bg-white">
          <DialogHeader className="items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-serif font-black text-gray-900">Delete Recipe?</DialogTitle>
            <DialogDescription className="text-gray-500 text-base">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{recipe.title}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 mt-8 sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 rounded-full border-gray-200 text-gray-600 font-bold h-12"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1 rounded-full bg-red-500 hover:bg-red-600 font-bold h-12 shadow-lg shadow-red-100"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="flex flex-col lg:flex-row min-h-full">
          {/* Image Section */}
          <div className="lg:w-5/12 h-[350px] lg:h-auto relative overflow-hidden group">
            <img 
              src={resolveCleanRecipeImage(recipe)} 
              alt={recipe.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-6 left-6 right-6 text-white lg:hidden">
              <Badge className="mb-2 bg-pink-500 hover:bg-pink-600 border-none rounded-full px-4 py-1 shadow-lg">
                {recipe.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight drop-shadow-md">{recipe.title}</h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-7/12 p-6 md:p-10 lg:p-14 space-y-10 relative bg-white">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
              <Heart className="h-64 w-64 text-pink-500 rotate-12" />
            </div>

            <div className="hidden lg:block space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="text-pink-600 border-pink-200 bg-pink-50 px-4 py-1.5 text-xs uppercase tracking-widest font-black rounded-full shadow-sm">
                  {recipe.category}
                </Badge>
                {isAuthor && (
                  <Badge variant="secondary" className={`px-4 py-1.5 text-xs uppercase tracking-widest font-black rounded-full shadow-sm ${recipe.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {recipe.isPublic ? 'Public' : 'Private'}
                  </Badge>
                )}
                {recipe.tags?.map(tag => (
                  <span key={tag} className="text-[11px] uppercase tracking-widest text-pink-400 font-bold self-center">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-gray-900 leading-[1.1] tracking-tight">
                {recipe.title}
              </h2>
              
              {/* Rating Section */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      disabled={isSubmittingRating}
                      className={`transition-all ${isSubmittingRating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          (userRating && star <= userRating) || (!userRating && star <= Math.round(recipe.averageRating || 0))
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-gray-900">
                    {recipe.averageRating || 0} <span className="text-gray-400 font-medium">/ 5</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {recipe.totalRatings || 0} Ratings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-black shadow-inner overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={recipe.authorName} className="w-full h-full object-cover" />
                    ) : recipe.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Created By</p>
                    <p className="font-bold text-gray-900">{recipe.authorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="h-5 w-5 text-pink-200" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</p>
                    <p className="text-xs font-bold text-gray-600">
                      {recipe.createdAt?.toDate ? recipe.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-auto">
                  <button 
                    onClick={handleToggleLike}
                    className="flex items-center gap-2 group transition-all"
                  >
                    <div className={`p-2 rounded-full transition-all ${isLiked ? 'bg-pink-100 text-pink-500' : 'bg-gray-50 text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-400'}`}>
                      <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className={`font-black text-sm ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}>
                      {recipe.likesCount || 0}
                    </span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="p-2 rounded-full bg-gray-50">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <span className="font-black text-sm">
                      {comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-pink-100 rounded-full" />
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light italic pl-6">
                {recipe.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-pink-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl shadow-sm">
                  <Clock className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Cook Time</p>
                  <p className="text-base font-black text-gray-900">{displayCookTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl shadow-sm">
                  <Users className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Servings</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 rounded-full hover:bg-pink-100 text-pink-500"
                      onClick={() => handleRescale(servings - 1)}
                      disabled={isRescaling || servings <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-base font-black text-gray-900 w-4 text-center">{servings}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 rounded-full hover:bg-pink-100 text-pink-500"
                      onClick={() => handleRescale(servings + 1)}
                      disabled={isRescaling}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {isRescaling && <Loader2 className="h-3 w-3 animate-spin text-pink-500 ml-1" />}
                    {!isRescaling && rescaledData && (
                      <Sparkles className="h-3 w-3 text-pink-500 ml-1 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-1 gap-12">
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-pink-50 pb-4">
                  <h3 className="text-3xl font-serif font-black flex items-center gap-4 text-gray-900">
                    <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-100">
                      <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    Ingredients
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pink-100 text-pink-600 hover:bg-pink-50 font-bold px-4"
                    onClick={() => {
                      displayIngredients.forEach(ing => {
                        if (!isInGroceryList(ing, recipe.id)) {
                          addToGroceryList(ing, recipe.title, recipe.id);
                        }
                      });
                      toast.success('All ingredients added to list');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add All
                  </Button>
                </div>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {displayIngredients.map((ing, i) => {
                    const inList = isInGroceryList(ing, recipe.id);
                    return (
                      <li key={i} className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-pink-50/30 border border-pink-50/50 hover:bg-pink-50 transition-all duration-300 group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`h-2 w-2 rounded-full transition-colors shrink-0 ${inList ? 'bg-pink-500' : 'bg-pink-300 group-hover:bg-pink-500'}`} />
                          <span className={`text-gray-700 font-medium truncate ${inList ? 'text-pink-600 font-bold' : ''}`}>{ing}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 rounded-full shrink-0 transition-all duration-300 ${
                            inList 
                              ? 'bg-pink-500 text-white hover:bg-pink-600' 
                              : 'bg-white text-pink-400 hover:bg-pink-100 hover:text-pink-600 border border-pink-100'
                          }`}
                          onClick={() => {
                            if (inList) {
                              const item = groceryList.find(item => item.originalName === ing && item.recipeId === recipe.id);
                              if (item) removeFromGroceryList(item.id);
                              toast.info('Removed from grocery list');
                            } else {
                              addToGroceryList(ing, recipe.title, recipe.id);
                              toast.success('Added to grocery list');
                            }
                          }}
                        >
                          {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <Separator className="bg-pink-50" />

              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-pink-50 pb-4">
                  <h3 className="text-3xl font-serif font-black flex items-center gap-4 text-gray-900">
                    <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-100">
                      <Printer className="h-5 w-5 text-white" />
                    </div>
                    Instructions
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrint} 
                    className="rounded-full border-pink-100 text-pink-600 hover:bg-pink-500 hover:text-white transition-all font-bold px-6"
                  >
                    Print Recipe
                  </Button>
                </div>
                <div className="space-y-10">
                  {displayInstructions.map((inst, i) => (
                    <div key={i} className="relative pl-16 group">
                      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-white border-2 border-pink-100 text-base font-black text-pink-500 shadow-sm group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-all duration-300">
                        {i + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="text-gray-700 leading-relaxed text-lg font-medium">
                          {inst}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-pink-50" />

              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-pink-50 pb-4">
                  <h3 className="text-3xl font-serif font-black flex items-center gap-4 text-gray-900">
                    <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-100">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    Community Chat
                  </h3>
                  <Badge variant="secondary" className="bg-pink-50 text-pink-500 border-none rounded-full px-4 font-bold">
                    {comments.length} Comments
                  </Badge>
                </div>

                <div className="space-y-6">
                  {user ? (
                    <form onSubmit={handleAddComment} className="flex gap-4 items-start bg-pink-50/30 p-4 rounded-3xl border border-pink-50">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={user.photoURL || ''} />
                        <AvatarFallback className="bg-pink-100 text-pink-500 font-bold">
                          {user.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea 
                          placeholder="Share your thoughts or a cooking tip..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px] bg-white border-pink-100 focus-visible:ring-pink-400 rounded-2xl resize-none"
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={isSubmittingComment || !newComment.trim()}
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 shadow-md shadow-pink-100"
                          >
                            {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-3xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium italic">Please sign in to join the conversation</p>
                    </div>
                  )}

                  <div className="space-y-6 mt-8">
                    <AnimatePresence mode="popLayout">
                      {comments.map((comment) => (
                        <motion.div 
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 group"
                        >
                          <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm">
                            <AvatarImage src={comment.authorPhoto} />
                            <AvatarFallback className="bg-pink-50 text-pink-400 font-bold">
                              {comment.authorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-black text-gray-900 text-sm">{comment.authorName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-pink-50 shadow-sm group-hover:border-pink-100 transition-colors">
                              <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {comments.length === 0 && (
                      <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-pink-50 text-pink-300 mb-4">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium italic">No comments yet. Be the first to say something!</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="pt-12 text-center space-y-4">
              <div className="flex justify-center opacity-20">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full" />
              </div>
              <p className="text-sm text-pink-300 font-serif italic">
                Made with love & shared for sweet moments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
