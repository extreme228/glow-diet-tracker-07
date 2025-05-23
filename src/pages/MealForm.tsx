import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import { getToday } from '@/lib/utils';

const MealForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateFromQuery = queryParams.get('date');
  
  const { 
    foods, 
    addMeal, 
    updateMeal, 
    getFood,
    meals, 
  } = useNutrition();
  
  const defaultDate = dateFromQuery || getToday();
  const defaultTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [items, setItems] = useState<{ id: string; foodId: string; quantity: number }[]>([]);
  
  const isEditMode = Boolean(id);
  
  useEffect(() => {
    if (isEditMode && id) {
      const meal = meals.find(m => m.id === id);
      if (meal) {
        setName(meal.name);
        setDate(meal.date);
        setTime(meal.time);
        setItems(meal.items.map(item => ({ ...item, id: crypto.randomUUID() })));
      }
    } else if (!isEditMode && foods.length > 0) {
      // Add one empty item when creating a new meal
      handleAddItem();
    }
  }, [isEditMode, id, meals, foods]);
  
  const handleAddItem = () => {
    if (foods.length === 0) return;
    
    setItems([
      ...items, 
      { 
        id: crypto.randomUUID(), 
        foodId: foods[0].id, 
        quantity: foods[0].servingSize || 100 
      }
    ]);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  const handleFoodChange = (itemId: string, foodId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const selectedFood = getFood(foodId);
        return { 
          ...item, 
          foodId, 
          quantity: selectedFood?.servingSize || 100
        };
      }
      return item;
    }));
  };
  
  const handleQuantityChange = (itemId: string, quantity: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: parseInt(quantity, 10) || 0 } : item
    ));
  };
  
  const calculateTotalCalories = () => {
    return items.reduce((total, item) => {
      const food = getFood(item.foodId);
      if (food) {
        return total + (food.calories * (item.quantity / 100));
      }
      return total;
    }, 0).toFixed(0);
  };
  
  const calculateMacros = () => {
    return items.reduce((acc, item) => {
      const food = getFood(item.foodId);
      if (food) {
        const multiplier = item.quantity / 100;
        acc.protein += food.protein * multiplier;
        acc.carbs += food.carbs * multiplier;
        acc.fat += food.fat * multiplier;
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format time to "HH:MM" if it's in "HHMM" format
    let formattedTime = time;
    if (time.length === 4 && !time.includes(':')) {
      formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;
    }
    
    // Create meal items with proper IDs
    const mealItems = items.map(({ foodId, quantity }) => ({ 
      id: crypto.randomUUID(),
      foodId, 
      quantity 
    }));
    
    const mealData = {
      name,
      date,
      time: formattedTime,
      items: mealItems,
    };
    
    if (isEditMode && id) {
      updateMeal({
        id,
        ...mealData,
      });
    } else {
      addMeal(mealData);
    }
    
    navigate('/');
  };
  
  const macros = calculateMacros();
  
  return (
    <div className="pt-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Refeição' : 'Nova Refeição'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glow-card p-5">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Refeição</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café da manhã"
                className="bg-nutritrack-card border-white/10 text-white placeholder:text-gray-500 focus:border-nutritrack-green"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-nutritrack-card border-white/10 text-white focus:border-nutritrack-green"
                />
              </div>
              
              <div>
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-nutritrack-card border-white/10 text-white focus:border-nutritrack-green"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glow-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Alimentos</h3>
            {foods.length > 0 && (
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-nutritrack-green/10 border-nutritrack-green/20 hover:bg-nutritrack-green/20 text-nutritrack-green"
              >
                <Plus size={16} />
                <span>Adicionar</span>
              </Button>
            )}
          </div>
          
          {foods.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Você ainda não cadastrou nenhum alimento</p>
              <Button 
                type="button"
                variant="link" 
                onClick={() => navigate('/add-food')}
                className="text-nutritrack-green mt-2"
              >
                Adicionar seu primeiro alimento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 items-end border-b border-white/10 pb-3"
                >
                  <div>
                    <Label htmlFor={`food-${item.id}`} className="mb-1 block">
                      Alimento {index + 1}
                    </Label>
                    <Select 
                      value={item.foodId}
                      onValueChange={(value) => handleFoodChange(item.id, value)}
                    >
                      <SelectTrigger className="bg-nutritrack-card border-white/10 focus:ring-nutritrack-green/20">
                        <SelectValue placeholder="Selecione um alimento" />
                      </SelectTrigger>
                      <SelectContent className="bg-nutritrack-card border-white/10 text-white">
                        {foods.map((food) => (
                          <SelectItem 
                            key={food.id} 
                            value={food.id}
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            {food.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`quantity-${item.id}`} className="mb-1 block">
                      Quantidade (g)
                    </Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-[100px] bg-nutritrack-card border-white/10 text-white focus:border-nutritrack-green"
                      min="0"
                      step="1"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-10 w-10 text-nutritrack-coral hover:text-white hover:bg-nutritrack-coral/20"
                    disabled={items.length <= 1}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              ))}
              
              <div className="bg-nutritrack-card/50 rounded-lg p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de calorias:</span>
                  <span className="font-semibold">{calculateTotalCalories()} kcal</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <div className="space-x-2">
                    <span className="text-nutritrack-green">P: {macros.protein.toFixed(1)}g</span>
                    <span className="text-nutritrack-blue">C: {macros.carbs.toFixed(1)}g</span>
                    <span className="text-nutritrack-purple">G: {macros.fat.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="glow-button-primary w-full md:w-auto"
            disabled={items.length === 0 || foods.length === 0}
          >
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Refeição'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MealForm;
