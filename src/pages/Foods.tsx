
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const Foods = () => {
  const { foods, deleteFood } = useNutrition();
  const [search, setSearch] = useState('');
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
  
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));
  
  const confirmDelete = (id: string) => {
    deleteFood(id);
    setFoodToDelete(null);
  };
  
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Alimentos</h1>
        <Link to="/add-food">
          <Button className="glow-button-primary">
            <Plus size={18} className="mr-2" />
            Novo Alimento
          </Button>
        </Link>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar alimentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-nutritrack-card border-white/10 text-white placeholder:text-gray-400 focus:border-nutritrack-green focus:ring-nutritrack-green/20"
        />
      </div>
      
      {filteredFoods.length === 0 ? (
        <div className="text-center py-12 glow-card">
          <p className="text-gray-400 mb-2">Nenhum alimento encontrado</p>
          <Link to="/add-food">
            <Button variant="link" className="text-nutritrack-green">
              Adicionar seu primeiro alimento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <div 
              key={food.id}
              className="glow-card p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{food.name}</h3>
                <p className="text-sm text-gray-400">{food.calories} kcal (por 100g)</p>
                <div className="flex gap-2 text-xs text-gray-400 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-nutritrack-green/20 text-nutritrack-green">
                    P: {food.protein}g
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-nutritrack-blue/20 text-nutritrack-blue">
                    C: {food.carbs}g
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-nutritrack-purple/20 text-nutritrack-purple">
                    G: {food.fat}g
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/edit-food/${food.id}`}>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 bg-nutritrack-green/10 border-nutritrack-green/20 hover:bg-nutritrack-green/20 text-nutritrack-green"
                  >
                    <Edit size={15} />
                  </Button>
                </Link>
                
                <Dialog open={foodToDelete === food.id} onOpenChange={(open) => !open && setFoodToDelete(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 bg-nutritrack-coral/10 border-nutritrack-coral/20 hover:bg-nutritrack-coral/20 text-nutritrack-coral"
                      onClick={() => setFoodToDelete(food.id)}
                    >
                      <Trash size={15} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-nutritrack-card border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Remover alimento</DialogTitle>
                    </DialogHeader>
                    <p>
                      Tem certeza que deseja remover o alimento "{food.name}"? 
                      Esta ação não pode ser desfeita.
                    </p>
                    <DialogFooter>
                      <Button 
                        variant="outline"
                        onClick={() => setFoodToDelete(null)}
                        className="border-white/10 hover:bg-white/5"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={() => confirmDelete(food.id)}
                        className="bg-nutritrack-coral hover:bg-nutritrack-coral/80"
                      >
                        Remover
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Foods;
