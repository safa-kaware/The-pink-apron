import { Recipe, toggleLike } from '@/lib/useRecipes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Share2, Heart, Trash2, MessageCircle, MoreHorizontal, Bookmark, Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { resolveCleanRecipeImage } from '@/lib/gemini';

interface RecipeCardProps {
  recipe: Recipe;
  currentUserId?: string;
  onClick: (recipe: Recipe) => void;
  onShare: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
  onImport?: (recipe: Recipe) => void;
  isCommunityView?: boolean;
}

export function RecipeCard({ recipe, currentUserId, onClick, onShare, onDelete, onToggleFavorite, onImport, isCommunityView }: RecipeCardProps) {
  const isAuthor = currentUserId === recipe.authorId;
  const isSystem = recipe.authorId === 'system';
  const isLiked = currentUserId ? recipe.likedBy?.includes(currentUserId) : false;
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(recipe.likesCount || 0);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) {
      toast.error('Please sign in to like recipes');
      return;
    }
    
    const newLikedState = !localLiked;
    setLocalLiked(newLikedState);
    setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      const isDiscover = recipe.authorId === 'system' && !recipe.id.startsWith('trending');
      const collectionName = isDiscover ? 'ai_discover_recipes' : 'recipes';
      await toggleLike(recipe.id, currentUserId, !localLiked, collectionName);
    } catch (error) {
      // Revert on error
      setLocalLiked(!newLikedState);
      setLocalLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const renderStars = (rating: number = 0, total: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-3 w-3 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        {total > 0 && <span className="text-[10px] font-bold text-gray-500 ml-1">({total})</span>}
      </div>
    );
  };

  if (isCommunityView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-pink-50">
              <AvatarFallback className="bg-pink-50 text-pink-500 text-[10px] font-bold">
                {recipe.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none">{recipe.authorName}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400 font-medium">{recipe.category}</span>
                {renderStars(recipe.averageRating, recipe.totalRatings)}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Image */}
        <div 
          className="aspect-square w-full overflow-hidden relative cursor-pointer"
          onClick={() => onClick(recipe)}
        >
          <img 
            src={resolveCleanRecipeImage(recipe)} 
            alt={recipe.title}
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Actions */}
        <div className="p-3 pb-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={`transition-transform active:scale-125 ${localLiked ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'}`}
              >
                <Heart className={`h-6 w-6 ${localLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => onClick(recipe)}
                className="text-gray-700 hover:text-pink-400 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onShare(recipe); }}
                className="text-gray-700 hover:text-pink-400 transition-colors"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {(!isAuthor || isSystem) && onImport && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-[10px] uppercase tracking-wider"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImport(recipe);
                  }}
                >
                  Import
                </Button>
              )}
              {onToggleFavorite && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe); }}
                  className={`transition-colors ${recipe.isFavorite ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'}`}
                >
                  <Bookmark className={`h-6 w-6 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-900">{localLikesCount} likes</p>
            <p className="text-sm text-gray-800 leading-snug">
              <span className="font-bold mr-2">{recipe.authorName}</span>
              {recipe.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {recipe.tags?.map(tag => (
                <span key={tag} className="text-xs text-blue-600 hover:underline cursor-pointer">#{tag}</span>
              ))}
            </div>
            <button 
              onClick={() => onClick(recipe)}
              className="text-xs text-gray-400 font-medium block pt-1"
            >
              View all comments
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layout
    >
      <Card 
        className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-2xl"
        onClick={() => onClick(recipe)}
      >
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <img 
            src={resolveCleanRecipeImage(recipe)} 
            alt={recipe.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <Badge className="bg-pink-500 text-white border-none shadow-lg px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full w-fit">
                {recipe.category}
              </Badge>
              {isAuthor && (
                <Badge variant="secondary" className={`text-[9px] uppercase tracking-tighter font-black px-2 py-0.5 rounded-full shadow-sm w-fit ${recipe.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {recipe.isPublic ? 'Public' : 'Private'}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full shadow-lg transition-all duration-300 ${
                    recipe.isFavorite 
                      ? 'bg-pink-500 text-white hover:bg-pink-600' 
                      : 'bg-white/90 text-pink-500 hover:bg-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe);
                  }}
                >
                  <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                </Button>
              )}
              {isAuthor && onDelete && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-6 w-6 rounded-full shadow-lg border border-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(recipe);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 px-3 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-pink-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(recipe);
                }}
              >
                View
              </Button>
              {(!isAuthor || isSystem) && onImport && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 px-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImport(recipe);
                  }}
                >
                  Import
                </Button>
              )}
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-pink-600"
              onClick={(e) => {
                e.stopPropagation();
                onShare(recipe);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start mb-1">
            {renderStars(recipe.averageRating, recipe.totalRatings)}
          </div>
          <CardTitle className="line-clamp-2 font-serif text-2xl leading-tight text-gray-900 group-hover:text-pink-600 transition-colors">
            {recipe.title}
          </CardTitle>
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem] font-light leading-relaxed">
            {recipe.description}
          </p>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex flex-wrap gap-1.5">
          {recipe.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-widest text-pink-500 font-bold">
              #{tag}
            </span>
          ))}
        </CardContent>
        <CardFooter className="p-5 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] font-bold">
              {recipe.authorName.charAt(0)}
            </div>
            <span className="text-xs font-medium text-gray-600">By {recipe.authorName}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] font-bold">25m</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
