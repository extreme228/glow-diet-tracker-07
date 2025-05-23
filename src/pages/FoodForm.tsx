
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const FoodForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addFood, updateFood, getFood } = useNutrition();
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('100');
  
  const isEditMode = Boolean(id);
  
  useEffect(() => {
    if (isEditMode && id) {
      const food = getFood(id);
      if (food) {
        setName(food.name);
        setCalories(food.calories.toString());
        setProtein(food.protein.toString());
        setCarbs(food.carbs.toString());
        setFat(food.fat.toString());
        setServingSize(food.servingSize.toString());
      }
    }
  }, [isEditMode, id, getFood]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const foodData = {
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      servingSize: parseFloat(servingSize),
    };
    
    if (isEditMode && id) {
      const existingFood = getFood(id);
      if (existingFood) {
        updateFood({
          ...existingFood,
          ...foodData,
        });
      }
    } else {
      addFood(foodData);
    }
    
    navigate('/foods');
  };
  
  return (
    <div className="pt-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/foods')}
          className="mr-4"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Alimento' : 'Novo Alimento'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glow-card p-5">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Alimento</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Frango Grelhado"
                className="bg-nutritrack-card border-white/10 text-white placeholder:text-gray-500 focus:border-nutritrack-green"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calorias (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  required
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Por 100g"
                  min="0"
                  step="0.1"
                  className="bg-nutritrack-card border-white/10 text-white placeholder:text-gray-500 focus:border-nutritrack-green"
                />
              </div>
              
              <div>
                <Label htmlFor="servingSize">Porção Padrão (g)</Label>
                <Input
                  id="servingSize"
                  type="number"
                  required
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  min="0"
                  step="1"
                  className="bg-nutritrack-card border-white/10 text-white placeholder:text-gray-500 focus:border-nutritrack-green"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glow-card p-5">
          <h3 className="text-lg font-medium mb-4">Macronutrientes (por 100g)</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein" className="text-nutritrack-green">Proteínas (g)</Label>
              <Input
                id="protein"
                type="number"
                required
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="0.1"
                className="bg-nutritrack-card border-white/10 text-nutritrack-green placeholder:text-gray-500 focus:border-nutritrack-green"
              />
            </div>
            
            <div>
              <Label htmlFor="carbs" className="text-nutritrack-blue">Carboidratos (g)</Label>
              <Input
                id="carbs"
                type="number"
                required
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="0.1"
                className="bg-nutritrack-card border-white/10 text-nutritrack-blue placeholder:text-gray-500 focus:border-nutritrack-blue"
              />
            </div>
            
            <div>
              <Label htmlFor="fat" className="text-nutritrack-purple">Gorduras (g)</Label>
              <Input
                id="fat"
                type="number"
                required
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="0.1"
                className="bg-nutritrack-card border-white/10 text-nutritrack-purple placeholder:text-gray-500 focus:border-nutritrack-purple"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-4">
            <p>A soma dos macronutrientes pode não corresponder exatamente ao peso total.</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="glow-button-primary w-full md:w-auto">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Alimento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
