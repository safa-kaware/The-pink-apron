import { useState, useEffect } from 'react';

export interface GroceryItem {
  id: string;
  name: string;
  recipeTitle: string;
  recipeId: string;
  completed: boolean;
  addedAt: number;
  originalName: string;
}

function simplifyIngredient(name: string): string {
  // 1. Remove everything after a comma, "until", "for", or "to"
  let simplified = name.split(/,|\suntil\s|\sfor\s|\sto\s/i)[0].trim();

  // 2. Remove leading numbers, fractions, and common measurements
  // Patterns like "1", "1/2", "1.5", "2-3"
  simplified = simplified.replace(/^[\d\s\/\-\.\u00BC-\u00BE\u2150-\u215E]+/, '').trim();

  // 3. Remove common units and descriptors
  const noiseWords = [
    'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
    'lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces', 'g', 'kg', 'ml', 'l',
    'bunch', 'bunches', 'clove', 'cloves', 'head', 'heads', 'can', 'cans', 'jar', 'jars',
    'package', 'packages', 'pkg', 'pkgs', 'container', 'containers', 'box', 'boxes',
    'large', 'medium', 'small', 'fresh', 'shredded', 'diced', 'chopped', 'minced',
    'sliced', 'peeled', 'halved', 'quartered', 'frozen', 'dried', 'ground', 'whole',
    'of', 'a', 'an', 'the', 'pinch', 'pinches', 'dash', 'dashes'
  ];

  const words = simplified.split(/\s+/);
  const filteredWords = words.filter(word => !noiseWords.includes(word.toLowerCase()));
  
  simplified = filteredWords.join(' ').trim();

  // If we stripped everything, fallback to the original first part
  if (!simplified) {
    simplified = name.split(',')[0].trim();
  }

  // Capitalize first letter
  return simplified.charAt(0).toUpperCase() + simplified.slice(1);
}

export function useGroceryList() {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('pink-apron-grocery-list');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pink-apron-grocery-list', JSON.stringify(groceryList));
  }, [groceryList]);

  const addToGroceryList = (ingredient: string, recipeTitle: string, recipeId: string) => {
    const newItem: GroceryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: simplifyIngredient(ingredient),
      originalName: ingredient,
      recipeTitle,
      recipeId,
      completed: false,
      addedAt: Date.now(),
    };
    setGroceryList(prev => [...prev, newItem]);
  };

  const removeFromGroceryList = (id: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const clearCompleted = () => {
    setGroceryList(prev => prev.filter(item => !item.completed));
  };

  const clearAll = () => {
    setGroceryList([]);
  };

  const isInGroceryList = (ingredient: string, recipeId: string) => {
    return groceryList.some(item => item.originalName === ingredient && item.recipeId === recipeId);
  };

  return {
    groceryList,
    addToGroceryList,
    removeFromGroceryList,
    toggleGroceryItem,
    clearCompleted,
    clearAll,
    isInGroceryList
  };
}
