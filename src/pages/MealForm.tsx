
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash, UtensilsCrossed, Clock, CalendarDays, Save } from 'lucide-react';
import { getToday } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const MealForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateFromQuery = queryParams.get('date');
  const { theme } = useTheme();
  const { toast } = useToast();
  
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
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da refeição é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um alimento à refeição",
        variant: "destructive",
      });
      return;
    }
    
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
    
    try {
      if (isEditMode && id) {
        updateMeal({
          id,
          ...mealData,
        });
        toast({
          title: "Sucesso!",
          description: "Refeição atualizada com sucesso",
        });
      } else {
        addMeal(mealData);
        toast({
          title: "Sucesso!",
          description: "Refeição adicionada com sucesso",
        });
      }
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a refeição",
        variant: "destructive",
      });
    }
  };
  
  const macros = calculateMacros();
  
  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/80 border-purple-500/30 backdrop-blur-sm";
    }
    return theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700/50";
  };
  
  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {isEditMode ? 'Editar Refeição' : 'Nova Refeição'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Atualize as informações da refeição' : 'Adicione uma nova refeição ao seu diário'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className={cn("border", getCardStyles())}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="name" className="flex items-center gap-2">
                  Nome da Refeição
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Café da Manhã, Almoço, Jantar..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Food Items */}
        <Card className={cn("border", getCardStyles())}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Alimentos</h3>
              </div>
              
              {foods.length > 0 && (
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-500"
                >
                  <Plus size={16} />
                  <span>Adicionar</span>
                </Button>
              )}
            </div>
            
            {foods.length === 0 ? (
              <div className="text-center py-8 rounded-lg border border-dashed border-border">
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground font-medium">Você ainda não cadastrou nenhum alimento</p>
                <Button 
                  type="button"
                  variant="link" 
                  onClick={() => navigate('/add-food')}
                  className="text-purple-500 mt-2"
                >
                  Adicionar seu primeiro alimento
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item, index) => {
                  const foodItem = getFood(item.foodId);
                  return (
                    <div 
                      key={item.id}
                      className="grid grid-cols-[1fr_auto_auto] gap-3 items-end border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <Label htmlFor={`food-${item.id}`} className="mb-1 block text-sm flex justify-between">
                          <span>Alimento {index + 1}</span>
                          {foodItem && (
                            <span className="text-xs text-muted-foreground">
                              {Math.round(foodItem.calories * item.quantity / 100)} kcal
                            </span>
                          )}
                        </Label>
                        <Select 
                          value={item.foodId}
                          onValueChange={(value) => handleFoodChange(item.id, value)}
                        >
                          <SelectTrigger className="bg-card border-input">
                            <SelectValue placeholder="Selecione um alimento" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-input">
                            {foods.map((food) => (
                              <SelectItem 
                                key={food.id} 
                                value={food.id}
                              >
                                {food.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`quantity-${item.id}`} className="text-sm mb-1 block">
                          Quantidade (g)
                        </Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-[100px] bg-card border-input"
                          min="0"
                          step="1"
                        />
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-10 w-10 text-red-500 hover:text-white hover:bg-red-500/20 self-end"
                        disabled={items.length <= 1}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  );
                })}
                
                {/* Nutritional summary */}
                {items.length > 0 && (
                  <div className="bg-card/50 rounded-lg p-4 mt-6 border border-border/50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Resumo da Refeição</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                        {calculateTotalCalories()} kcal
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span>Proteínas: {macros.protein.toFixed(1)}g</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span>Carboidratos: {macros.carbs.toFixed(1)}g</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span>Gorduras: {macros.fat.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className={cn(
              "flex items-center gap-2",
              theme === 'vibrant' && "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-glow-vibrant"
            )}
            disabled={items.length === 0 || foods.length === 0}
          >
            <Save size={16} />
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Refeição'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MealForm;
