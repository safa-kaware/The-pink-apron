import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex w-max space-x-2 p-1">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selected === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(category)}
            className={`rounded-full px-6 transition-all duration-300 ${
              selected === category 
                ? 'bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-100' 
                : 'border-pink-100 text-pink-600 hover:bg-pink-50'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
