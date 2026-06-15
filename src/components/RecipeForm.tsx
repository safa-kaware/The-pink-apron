import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/lib/useRecipes';
import { db, addDoc, collection, serverTimestamp, updateDoc, doc, OperationType, handleFirestoreError, query, where, getDocs } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { extractRecipeFromUrl, generateRecipeImage } from '@/lib/gemini';
import { parseRecipeText } from '@/services/aiService';
import { X, Plus, Trash2, Loader2, Sparkles, Link as LinkIcon, Image as ImageIcon, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface RecipeFormProps {
  recipe?: Recipe;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'];

export function RecipeForm({ recipe, onSuccess, onCancel }: RecipeFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [quickPaste, setQuickPaste] = useState('');
  const [showQuickPaste, setShowQuickPaste] = useState(false);
  
  const [title, setTitle] = useState(recipe?.title || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [category, setCategory] = useState(recipe?.category || CATEGORIES[0]);
  const [ingredients, setIngredients] = useState<string[]>(recipe?.ingredients || ['']);
  const [instructions, setInstructions] = useState<string[]>(recipe?.instructions || ['']);
  const [tags, setTags] = useState<string[]>(recipe?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || '');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [isPublic, setIsPublic] = useState(recipe?.isPublic ?? true);

  const handleGenerateImage = async () => {
    if (!title) {
      toast.error('Please enter a recipe title first');
      return;
    }

    setGeneratingImage(true);
    try {
      const generatedUrl = await generateRecipeImage(title, description);
      setImageUrl(generatedUrl);
      toast.success('AI Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
      console.error(error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleExtract = async () => {
    if (!importUrl) {
      toast.error('Please enter a URL first');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to import recipes');
      return;
    }

    setExtracting(true);
    try {
      const extracted = await extractRecipeFromUrl(importUrl);
      
      // Check for duplicates in user's collection
      const q = query(
        collection(db, 'recipes'), 
        where('authorId', '==', user.uid),
        where('title', '==', extracted.title)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast.error('This recipe already exists in your collection!');
        setExtracting(false);
        return;
      }

      // Auto-populate state
      setTitle(extracted.title || '');
      setDescription(extracted.description || '');
      
      // Improved categorization logic
      let finalCategory = CATEGORIES[0]; // Default
      if (extracted.category && CATEGORIES.includes(extracted.category)) {
        finalCategory = extracted.category;
      } else {
        // Fallback categorization based on keywords if AI fails to pick one from our list
        const text = (extracted.title + ' ' + extracted.description).toLowerCase();
        if (text.includes('breakfast') || text.includes('egg') || text.includes('pancake')) finalCategory = 'Breakfast';
        else if (text.includes('lunch') || text.includes('sandwich') || text.includes('salad')) finalCategory = 'Lunch';
        else if (text.includes('dinner') || text.includes('steak') || text.includes('pasta')) finalCategory = 'Dinner';
      }
      setCategory(finalCategory);

      if (extracted.ingredients?.length > 0) {
        setIngredients(extracted.ingredients);
      }
      if (extracted.instructions?.length > 0) {
        setInstructions(extracted.instructions);
      }
      if (extracted.tags?.length > 0) {
        setTags(extracted.tags);
      }
      if (extracted.imageUrl) {
        setImageUrl(extracted.imageUrl);
      }

      // Hands-free save logic
      if (extracted.title && extracted.ingredients?.length > 0 && extracted.instructions?.length > 0) {
        setLoading(true);
        let finalImageUrl = extracted.imageUrl || '';
        if (!finalImageUrl) {
          try {
            finalImageUrl = await generateRecipeImage(extracted.title, extracted.description || finalCategory);
          } catch (e) {
            console.error('Image generation during auto-save failed:', e);
          }
        }

        const recipeData = {
          title: extracted.title,
          description: extracted.description || '',
          category: finalCategory,
          ingredients: extracted.ingredients.filter(i => i.trim()),
          instructions: extracted.instructions.filter(i => i.trim()),
          tags: (extracted.tags || []).filter(t => t.trim()),
          imageUrl: finalImageUrl,
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous',
          isPublic: isPublic,
          likedBy: [],
          likesCount: 0,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'recipes'), recipeData);
        toast.success('Recipe automatically extracted, categorized, and saved with a matching culinary image!');
        onSuccess();
      } else {
        toast.success('Recipe details extracted! Please review and save.');
      }
    } catch (error: any) {
      if (error.message?.includes('AI Quota Exceeded')) {
        toast.error(error.message, {
          description: "Alternative: You can still add your recipe manually below!",
          duration: 6000
        });
      } else {
        toast.error('Failed to extract recipe. Please check the URL or enter details manually.');
      }
      console.error(error);
    } finally {
      setExtracting(false);
      setLoading(false);
    }
  };

  const handleQuickParse = async () => {
    if (!quickPaste.trim()) {
      toast.error('Please paste some recipe text first');
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseRecipeText(quickPaste);
      
      setTitle(parsed.title);
      setDescription(parsed.description);
      setIngredients(parsed.ingredients);
      setInstructions(parsed.instructions);
      setTags(parsed.tags);
      if (CATEGORIES.includes(parsed.category)) {
        setCategory(parsed.category);
      }
      
      toast.success('Recipe parsed successfully! Please review the details.');
      setShowQuickPaste(false);
    } catch (error) {
      toast.error('Failed to parse text. Please try again or enter manually.');
      console.error(error);
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title || ingredients.some(i => !i) || instructions.some(i => !i)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      toast.info('Generating a beautifully matching culinary image for your recipe...');
      try {
        finalImageUrl = await generateRecipeImage(title, description || category);
      } catch (err) {
        console.error('Image generation failed during submission:', err);
      }
    }

    const recipeData = {
      title,
      description,
      category,
      ingredients: ingredients.filter(i => i.trim()),
      instructions: instructions.filter(i => i.trim()),
      tags: tags.filter(t => t.trim()),
      imageUrl: finalImageUrl,
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      isPublic: isPublic,
      likedBy: [],
      likesCount: 0,
      updatedAt: serverTimestamp(),
    };

    try {
      if (recipe) {
        await updateDoc(doc(db, 'recipes', recipe.id), recipeData);
        toast.success('Recipe updated successfully!');
      } else {
        await addDoc(collection(db, 'recipes'), {
          ...recipeData,
          createdAt: serverTimestamp(),
        });
        toast.success('Recipe added successfully!');
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, recipe ? OperationType.UPDATE : OperationType.CREATE, 'recipes');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {!recipe && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant={!showQuickPaste ? 'default' : 'outline'}
              onClick={() => setShowQuickPaste(false)}
              className={`flex-1 rounded-full ${!showQuickPaste ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-100 text-pink-500'}`}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Import URL
            </Button>
            <Button 
              type="button" 
              variant={showQuickPaste ? 'default' : 'outline'}
              onClick={() => setShowQuickPaste(true)}
              className={`flex-1 rounded-full ${showQuickPaste ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-100 text-pink-500'}`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Quick AI Paste
            </Button>
          </div>

          {!showQuickPaste ? (
            <div className="p-4 bg-pink-50 rounded-3xl border border-pink-100 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-pink-700 font-medium text-sm">
                <Sparkles className="h-4 w-4" />
                <span>AI Recipe Import</span>
              </div>
              <p className="text-xs text-pink-400">
                Paste a YouTube URL or a link to a recipe, and we'll try to extract the magic for you.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
                  <Input 
                    className="pl-9 border-pink-100 focus-visible:ring-pink-400 bg-white rounded-full"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleExtract} 
                  disabled={extracting}
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
                >
                  {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Import'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-pink-50 rounded-3xl border border-pink-100 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-pink-700 font-medium text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Quick AI Paste</span>
              </div>
              <p className="text-xs text-pink-400">
                Paste rough notes, a blog post, or just a list of ingredients and steps. We'll structure it for you!
              </p>
              <div className="space-y-2">
                <Textarea 
                  className="border-pink-100 focus-visible:ring-pink-400 bg-white rounded-2xl min-h-[100px]"
                  placeholder="Paste your recipe text here..."
                  value={quickPaste}
                  onChange={(e) => setQuickPaste(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={handleQuickParse} 
                  disabled={parsing}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                >
                  {parsing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {parsing ? 'Parsing...' : 'Parse with AI'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Recipe Title *</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Grandma's Apple Pie"
            className="rounded-xl border-pink-100 focus-visible:ring-pink-400"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Tell us a bit about this recipe..."
            className="rounded-xl border-pink-100 focus-visible:ring-pink-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <select 
              id="category"
              className="flex h-10 w-full rounded-xl border border-pink-100 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
                <Input 
                  id="imageUrl" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="https://..."
                  className="pl-9 rounded-xl border-pink-100 focus-visible:ring-pink-400"
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGenerateImage}
                disabled={generatingImage}
                className="rounded-xl border-pink-100 text-pink-500 hover:bg-pink-50 min-w-[120px]"
              >
                {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Image</span>
                  </div>
                )}
              </Button>
            </div>
            {imageUrl && (
              <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-pink-50">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => setImageUrl('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
          <div className="space-y-0.5">
            <Label htmlFor="isPublic" className="text-base font-bold text-gray-900">Share with Community</Label>
            <p className="text-xs text-gray-500">Make this recipe visible to everyone in the Community feed.</p>
          </div>
          <div 
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isPublic ? 'bg-pink-500' : 'bg-gray-300'}`}
            onClick={() => setIsPublic(!isPublic)}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ingredients *</Label>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2">
              <Input 
                value={ing} 
                onChange={(e) => updateIngredient(index, e.target.value)} 
                placeholder={`Ingredient ${index + 1}`}
                className="rounded-xl border-pink-100 focus-visible:ring-pink-400"
                required
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
                className="hover:bg-pink-50"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="w-full rounded-full border-pink-100 text-pink-600 hover:bg-pink-50">
            <Plus className="mr-2 h-4 w-4" /> Add Ingredient
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Instructions *</Label>
          {instructions.map((inst, index) => (
            <div key={index} className="flex gap-2">
              <Textarea 
                value={inst} 
                onChange={(e) => updateInstruction(index, e.target.value)} 
                placeholder={`Step ${index + 1}`}
                className="rounded-xl border-pink-100 focus-visible:ring-pink-400"
                required
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeInstruction(index)}
                disabled={instructions.length === 1}
                className="hover:bg-pink-50"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addInstruction} className="w-full rounded-full border-pink-100 text-pink-600 hover:bg-pink-50">
            <Plus className="mr-2 h-4 w-4" /> Add Step
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (Press Enter to add)</Label>
          <Input 
            id="tags" 
            value={tagInput} 
            onChange={(e) => setTagInput(e.target.value)} 
            onKeyDown={addTag}
            placeholder="e.g. vegan, spicy, quick"
            className="rounded-xl border-pink-100 focus-visible:ring-pink-400"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <Badge key={tag} className="gap-1 px-3 py-1 bg-pink-100 text-pink-600 hover:bg-pink-200 border-none rounded-full text-xs font-bold">
                #{tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full text-gray-400 hover:text-pink-500 hover:bg-pink-50">Cancel</Button>
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 shadow-md shadow-pink-100" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {recipe ? 'Update Recipe' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
}
