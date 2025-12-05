import { MealType, MEAL_NAMES, getMealPrices } from '@/types';
import { Button } from '@/components/ui/button';
import { Coffee, UtensilsCrossed, Star } from 'lucide-react';

interface MealButtonsProps {
  onSelect: (mealType: MealType) => void;
  disabled?: boolean;
  selectedType?: MealType;
}

const mealIcons: Record<MealType, typeof Coffee> = {
  mini: Coffee,
  full: UtensilsCrossed,
  special: Star,
};

const mealVariants: Record<MealType, 'mealMini' | 'mealFull' | 'mealSpecial'> = {
  mini: 'mealMini',
  full: 'mealFull',
  special: 'mealSpecial',
};

export function MealButtons({ onSelect, disabled, selectedType }: MealButtonsProps) {
  const mealPrices = getMealPrices();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(['mini', 'full', 'special'] as MealType[]).map((type) => {
        const Icon = mealIcons[type];
        const isSelected = selectedType === type;
        
        return (
          <Button
            key={type}
            variant={mealVariants[type]}
            size="xl"
            onClick={() => onSelect(type)}
            disabled={disabled}
            className={`flex-col h-auto py-6 ${isSelected ? 'ring-2 ring-ring ring-offset-2' : ''}`}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-lg font-semibold">{MEAL_NAMES[type]}</span>
            <span className="text-sm opacity-90">₹{mealPrices[type]}</span>
          </Button>
        );
      })}
    </div>
  );
}
