import { GroceryItem, useGroceryList } from '@/lib/useGroceryList';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, CheckCircle2, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function GroceryList() {
  const { 
    groceryList, 
    toggleGroceryItem, 
    removeFromGroceryList, 
    clearCompleted, 
    clearAll 
  } = useGroceryList();

  const completedCount = groceryList.filter(item => item.completed).length;
  const totalCount = groceryList.length;

  // Group items by recipe
  const groupedItems = groceryList.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = {
        title: item.recipeTitle,
        items: []
      };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {} as Record<string, { title: string, items: GroceryItem[] }>);

  if (groceryList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-pink-50 flex items-center justify-center mb-6">
          <ShoppingBasket className="h-10 w-10 text-pink-300" />
        </div>
        <h2 className="text-2xl font-serif font-black text-gray-900 mb-2">Your list is empty</h2>
        <p className="text-gray-500 max-w-xs mb-8 text-sm">
          Add missing ingredients from any recipe to build your shopping list.
        </p>
        <Button 
          className="rounded-full bg-pink-500 hover:bg-pink-600 text-white px-8 h-11 font-bold shadow-lg shadow-pink-100"
          onClick={() => window.location.href = '/'}
        >
          Find Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif font-black text-gray-900 mb-1">Shopping List</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            {completedCount} / {totalCount} Items Checked
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-pink-500 hover:text-pink-600 hover:bg-pink-50 font-bold text-xs uppercase tracking-wider"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear Done
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 font-bold text-xs uppercase tracking-wider"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {Object.entries(groupedItems).map(([recipeId, group]) => (
          <div key={recipeId} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-pink-200 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-pink-400">
                {group.title}
              </h3>
            </div>
            
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {group.items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-pink-50/50 transition-colors"
                  >
                    <button 
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        item.completed 
                          ? 'bg-pink-500 border-pink-500 text-white' 
                          : 'border-pink-100 bg-white hover:border-pink-300'
                      }`}
                      onClick={() => toggleGroceryItem(item.id)}
                    >
                      {item.completed && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    
                    <span className={`flex-1 text-base font-medium transition-all duration-300 ${
                      item.completed ? 'text-gray-300 line-through' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>

                    <button 
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-400 transition-all"
                      onClick={() => removeFromGroceryList(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-pink-50 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 text-xs font-black uppercase tracking-widest">
          <ShoppingCart className="h-3 w-3" />
          Happy Cooking
        </div>
      </div>
    </div>
  );
}
