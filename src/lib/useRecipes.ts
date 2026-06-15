import { useState, useEffect, useCallback } from 'react';
import { db, collection, query, where, orderBy, onSnapshot, OperationType, handleFirestoreError, doc, updateDoc, arrayUnion, arrayRemove, increment, limit, startAfter, getDocs, setDoc } from './firebase';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  isPublic: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  likedBy?: string[];
  likesCount?: number;
  averageRating?: number;
  totalRatings?: number;
  createdAt: any;
  updatedAt: any;
}

export function useRecipes(category?: string, userId?: string, pageSize: number = 6) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const fetchRecipes = useCallback(async (isFirstLoad: boolean = true) => {
    if (isFirstLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));

      if (category && category !== 'All') {
        q = query(q, where('category', '==', category));
      }

      if (userId) {
        q = query(q, where('authorId', '==', userId));
      } else {
        q = query(q, where('isPublic', '==', true));
      }

      if (!isFirstLoad && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);
      const recipeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];

      if (isFirstLoad) {
        setRecipes(recipeData);
      } else {
        setRecipes(prev => [...prev, ...recipeData]);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'recipes');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, userId, pageSize, lastDoc]);

  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchRecipes(true);
  }, [category, userId]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchRecipes(false);
    }
  };

  return { recipes, loading, loadingMore, hasMore, loadMore };
}

export async function toggleFavorite(recipeId: string, currentStatus: boolean) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await updateDoc(recipeRef, {
      isFavorite: !currentStatus,
      updatedAt: new Date()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `recipes/${recipeId}`);
  }
}

export async function toggleLike(recipeId: string, userId: string, isLiked: boolean, collectionName: string = 'recipes') {
  try {
    const recipeRef = doc(db, collectionName, recipeId);
    await updateDoc(recipeRef, {
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
      likesCount: increment(isLiked ? -1 : 1),
      updatedAt: new Date()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${recipeId}`);
  }
}

export async function submitRating(recipeId: string, userId: string, rating: number, currentAverage: number = 0, currentTotal: number = 0, collectionName: string = 'recipes') {
  try {
    const ratingRef = doc(db, collectionName, recipeId, 'ratings', userId);
    const ratingDoc = await getDocs(query(collection(db, collectionName, recipeId, 'ratings'), where('__name__', '==', userId)));
    
    const isNewRating = ratingDoc.empty;
    const oldRating = !isNewRating ? ratingDoc.docs[0].data().rating : 0;

    // Calculate new average
    let newTotal = currentTotal;
    let newAverage = currentAverage;

    if (isNewRating) {
      newTotal = currentTotal + 1;
      newAverage = ((currentAverage * currentTotal) + rating) / newTotal;
    } else {
      newAverage = ((currentAverage * currentTotal) - oldRating + rating) / currentTotal;
    }

    // Update rating doc
    await setDoc(ratingRef, {
      rating,
      updatedAt: new Date()
    });

    // Update recipe doc
    const recipeRef = doc(db, collectionName, recipeId);
    await updateDoc(recipeRef, {
      averageRating: Number(newAverage.toFixed(1)),
      totalRatings: newTotal,
      updatedAt: new Date()
    });

    return { newAverage, newTotal };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${recipeId}/ratings`);
    throw error;
  }
}
