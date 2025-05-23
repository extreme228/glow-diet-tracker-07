
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNutrition } from '@/context/NutritionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, Save, AlertCircle, CheckCircle, Beef, Apple, Wheat, Milk } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

const foodCategories = [
  { id: 'protein', name: 'Proteínas', icon: Beef, color: 'bg-red-500' },
  { id: 'carbs', name: 'Carboidratos', icon: Wheat, color: 'bg-yellow-500' },
  { id: 'dairy', name: 'Laticínios', icon: Milk, color: 'bg-blue-500' },
  { id: 'fruits', name: 'Frutas', icon: Apple, color: 'bg-green-500' },
  { id: 'vegetables', name: 'Vegetais', icon: Apple, color: 'bg-emerald-500' },
  { id: 'grains', name: 'Grãos', icon: Wheat, color: 'bg-amber-500' },
  { id: 'fats', name: 'Gorduras', icon: Apple, color: 'bg-orange-500' },
  { id: 'other', name: 'Outros', icon: Apple, color: 'bg-gray-500' },
];

const commonUnits = [
  { value: '100', label: '100g (padrão)' },
  { value: '1', label: '1g' },
  { value: '250', label: '250g (1 xícara)' },
  { value: '200', label: '200ml (1 copo)' },
  { value: '15', label: '15ml (1 colher de sopa)' },
  { value: '5', label: '5ml (1 colher de chá)' },
  { value: '30', label: '30g (1 oz)' },
];

const FoodForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addFood, updateFood, getFood } = useNutrition();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('100');
  const [category, setCategory] = useState('other');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  
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

  // Calculate nutritional density score
  const calculateScore = () => {
    const cal = parseFloat(calories) || 0;
    const prot = parseFloat(protein) || 0;
    
    if (cal === 0) return 0;
    
    const proteinScore = (prot * 4 / cal) * 100; // Protein percentage of calories
    const density = prot / (cal / 100); // Protein per 100 calories
    
    return Math.min(Math.round((proteinScore + density) / 2), 100);
  };

  const nutritionScore = calculateScore();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do alimento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const foodData = {
      name: name.trim(),
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      servingSize: parseFloat(servingSize) || 100,
    };

    // Check if macros add up reasonably
    const totalMacroCalories = (foodData.protein * 4) + (foodData.carbs * 4) + (foodData.fat * 9);
    const calorieDifference = Math.abs(foodData.calories - totalMacroCalories);
    
    if (calorieDifference > foodData.calories * 0.2) {
      toast({
        title: "Atenção",
        description: "As calorias podem não estar condizentes com os macronutrientes informados",
        variant: "destructive",
      });
    }
    
    try {
      if (isEditMode && id) {
        const existingFood = getFood(id);
        if (existingFood) {
          updateFood({
            ...existingFood,
            ...foodData,
          });
          toast({
            title: "Sucesso!",
            description: "Alimento atualizado com sucesso",
          });
        }
      } else {
        addFood(foodData);
        toast({
          title: "Sucesso!",
          description: "Alimento adicionado com sucesso",
        });
      }
      
      navigate('/foods');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o alimento",
        variant: "destructive",
      });
    }
  };

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
          onClick={() => navigate('/foods')}
          className="rounded-full"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            {isEditMode ? 'Editar Alimento' : 'Novo Alimento'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Atualize as informações do alimento' : 'Adicione um novo alimento à sua biblioteca'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={cn("p-6 rounded-xl border", getCardStyles())}>
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                Nome do Alimento
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Frango Grelhado, Arroz Integral..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Marca (opcional)</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Sadia, Nestlé..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className={cn("p-6 rounded-xl border", getCardStyles())}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Informações Nutricionais</h3>
            </div>
            
            {nutritionScore > 0 && (
              <Badge 
                variant="secondary" 
                className={cn("flex items-center gap-1", getScoreColor(nutritionScore))}
              >
                {nutritionScore >= 60 ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {getScoreLabel(nutritionScore)} ({nutritionScore})
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="servingSize">Porção de Referência</Label>
              <Select value={servingSize} onValueChange={setServingSize}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="calories" className="flex items-center gap-2">
                Calorias (kcal)
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="calories"
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein" className="text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Proteínas (g)
              </Label>
              <Input
                id="protein"
                type="number"
                required
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="0.1"
                placeholder="0"
                className="mt-1 border-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <Label htmlFor="carbs" className="text-blue-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Carboidratos (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                required
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="0.1"
                placeholder="0"
                className="mt-1 border-blue-500/30 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="fat" className="text-purple-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Gorduras (g)
              </Label>
              <Input
                id="fat"
                type="number"
                required
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="0.1"
                placeholder="0"
                className="mt-1 border-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>
          
          {/* Nutritional preview */}
          {(calories || protein || carbs || fat) && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/20 border border-border/50">
              <h4 className="text-sm font-medium mb-2">Resumo por {servingSize}g:</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-orange-500">{calories || 0}</div>
                  <div className="text-muted-foreground">kcal</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-emerald-500">{protein || 0}g</div>
                  <div className="text-muted-foreground">proteína</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-500">{carbs || 0}g</div>
                  <div className="text-muted-foreground">carboidrato</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-500">{fat || 0}g</div>
                  <div className="text-muted-foreground">gordura</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className={cn("p-6 rounded-xl border", getCardStyles())}>
          <Label htmlFor="notes">Observações (opcional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Rico em vitamina C, fonte de fibras..."
            className="mt-1 w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/foods')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className={cn(
              "flex items-center gap-2",
              theme === 'vibrant' && "bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-glow-vibrant"
            )}
          >
            <Save size={16} />
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Alimento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
