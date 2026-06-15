import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { UtensilsCrossed, LogIn, LogOut, Plus, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onAddRecipe: () => void;
  onViewMyRecipes: () => void;
  onViewAllRecipes: () => void;
  onViewDiscover: () => void;
  onViewFavorites: () => void;
  onViewGroceryList: () => void;
  onViewHome: () => void;
  activeView: 'discover' | 'community' | 'my-recipes' | 'favorites' | 'grocery-list' | 'landing';
}

export function Navbar({ onAddRecipe, onViewMyRecipes, onViewAllRecipes, onViewDiscover, onViewFavorites, onViewGroceryList, onViewHome, activeView }: NavbarProps) {
  const { user, signIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          className="flex cursor-pointer items-center gap-2 group"
          onClick={onViewHome}
        >
          <div className="p-2 bg-pink-500 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-pink-200 shadow-lg">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-serif font-black tracking-tight text-gray-900">
            The Pink <span className="text-pink-500">Apron</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 md:gap-6 mr-2 md:mr-4">
            <button 
              onClick={onViewDiscover}
              className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                activeView === 'discover' ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              Discover
            </button>
            <button 
              onClick={onViewAllRecipes}
              className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                activeView === 'community' ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              Community
            </button>
            {user && (
              <>
                <button 
                  onClick={onViewMyRecipes}
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeView === 'my-recipes' ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                  }`}
                >
                  My Recipes
                </button>
                <button 
                  onClick={onViewFavorites}
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeView === 'favorites' ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                  }`}
                >
                  Favorites
                </button>
                <button 
                  onClick={onViewGroceryList}
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeView === 'grocery-list' ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                  }`}
                >
                  Grocery List
                </button>
              </>
            )}
          </div>

          {user ? (
            <>
              <Button 
                onClick={onAddRecipe}
                className="bg-pink-500 hover:bg-pink-600 text-white gap-2 rounded-full shadow-md shadow-pink-100"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Recipe</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative h-10 w-10 rounded-full cursor-pointer overflow-hidden border hover:ring-2 hover:ring-pink-500 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={onViewMyRecipes}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>My Recipes</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              onClick={signIn}
              className="bg-pink-500 hover:bg-pink-600 text-white gap-2 rounded-full shadow-md shadow-pink-100"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
