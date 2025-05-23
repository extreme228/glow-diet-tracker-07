
import React, { useState, useMemo } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Filter, Heart, Star, Apple, Beef, Wheat, Milk } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const foodCategories = [
  { id: 'all', name: 'Todos', icon: Apple, color: 'bg-gray-500' },
  { id: 'protein', name: 'Proteínas', icon: Beef, color: 'bg-red-500' },
  { id: 'carbs', name: 'Carboidratos', icon: Wheat, color: 'bg-yellow-500' },
  { id: 'dairy', name: 'Laticínios', icon: Milk, color: 'bg-blue-500' },
  { id: 'fruits', name: 'Frutas', icon: Apple, color: 'bg-green-500' },
  { id: 'vegetables', name: 'Vegetais', icon: Apple, color: 'bg-emerald-500' },
];

const Foods = () => {
  const { foods, deleteFood } = useNutrition();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);

  const toggleFavorite = (foodId: string) => {
    setFavorites(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  const filteredAndSortedFoods = useMemo(() => {
    let filtered = foods.filter(food => 
      food.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort foods
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calories':
          return b.calories - a.calories;
        case 'protein':
          return b.protein - a.protein;
        case 'favorites':
          const aFav = favorites.includes(a.id);
          const bFav = favorites.includes(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [foods, search, selectedCategory, sortBy, favorites]);

  const confirmDelete = (id: string) => {
    deleteFood(id);
    setFoodToDelete(null);
  };

  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/80 border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm";
    }
    return "glow-card";
  };

  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            theme === 'light' ? "bg-emerald-100" : "bg-emerald-500/20"
          )}>
            <Apple className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Biblioteca de Alimentos
            </h1>
            <p className="text-sm text-muted-foreground">{foods.length} alimentos cadastrados</p>
          </div>
        </div>
        <Link to="/add-food">
          <Button className={cn(
            "glow-button-primary flex items-center gap-2",
            theme === 'vibrant' && "bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-glow-vibrant"
          )}>
            <Plus size={18} />
            Novo Alimento
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className={cn("p-4 rounded-xl border", getCardStyles())}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar alimentos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-4 bg-secondary/20 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Ordenar por:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="calories">Calorias</SelectItem>
                    <SelectItem value="protein">Proteína</SelectItem>
                    <SelectItem value="favorites">Favoritos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {foodCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <category.icon size={14} />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Foods Grid */}
      {filteredAndSortedFoods.length === 0 ? (
        <div className={cn("text-center py-16 rounded-xl border", getCardStyles())}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum alimento encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {search ? `Nenhum resultado para "${search}"` : 'Comece adicionando seus primeiros alimentos'}
          </p>
          <Link to="/add-food">
            <Button className="glow-button-primary">
              <Plus size={16} className="mr-2" />
              Adicionar Alimento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedFoods.map((food) => (
            <div 
              key={food.id}
              className={cn(
                "p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] group relative",
                getCardStyles()
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(food.id)}
                      className={cn(
                        "h-8 w-8 hover:scale-110 transition-transform",
                        favorites.includes(food.id) 
                          ? "text-red-500 hover:text-red-600" 
                          : "text-muted-foreground hover:text-red-400"
                      )}
                    >
                      <Heart 
                        size={16} 
                        className={favorites.includes(food.id) ? "fill-current" : ""} 
                      />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-orange-500">
                      <span className="text-2xl font-bold">{food.calories}</span>
                      <span className="text-sm">kcal</span>
                    </div>
                    <span className="text-xs text-muted-foreground">por 100g</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      P: {food.protein}g
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      C: {food.carbs}g
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      G: {food.fat}g
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link to={`/edit-food/${food.id}`}>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-9 w-9 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400"
                    >
                      <Edit size={16} />
                    </Button>
                  </Link>
                  
                  <Dialog open={foodToDelete === food.id} onOpenChange={(open) => !open && setFoodToDelete(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                        onClick={() => setFoodToDelete(food.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={cn(
                      "border",
                      theme === 'light' ? "bg-white" : "bg-gray-900 border-gray-800"
                    )}>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Trash className="w-5 h-5 text-red-500" />
                          Remover alimento
                        </DialogTitle>
                      </DialogHeader>
                      <p className="text-muted-foreground">
                        Tem certeza que deseja remover o alimento <strong>"{food.name}"</strong>? 
                        Esta ação não pode ser desfeita.
                      </p>
                      <DialogFooter>
                        <Button 
                          variant="outline"
                          onClick={() => setFoodToDelete(null)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={() => confirmDelete(food.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash size={16} className="mr-2" />
                          Remover
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Favorite indicator */}
              {favorites.includes(food.id) && (
                <div className="absolute top-3 left-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Foods;
