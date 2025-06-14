
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NutritionProvider } from "./context/NutritionContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Foods from "./pages/Foods";
import FoodForm from "./pages/FoodForm";
import MealForm from "./pages/MealForm";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Weight from "./pages/Weight";
import Advanced from "./pages/Advanced";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NutritionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/foods" element={<Foods />} />
                <Route path="/add-food" element={<FoodForm />} />
                <Route path="/edit-food/:id" element={<FoodForm />} />
                <Route path="/add-meal" element={<MealForm />} />
                <Route path="/edit-meal/:id" element={<MealForm />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/weight" element={<Weight />} />
                <Route path="/advanced" element={<Advanced />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NutritionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
