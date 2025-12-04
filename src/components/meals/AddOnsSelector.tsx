import { useState } from 'react';
import { AddOn, ADDON_OPTIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddOnsSelectorProps {
  selectedAddons: AddOn[];
  onChange: (addons: AddOn[]) => void;
}

export function AddOnsSelector({ selectedAddons, onChange }: AddOnsSelectorProps) {
  const [customAddon, setCustomAddon] = useState({ name: '', price: '' });

  const addAddon = (name: string, defaultPrice: number) => {
    const existing = selectedAddons.find((a) => a.name === name);
    if (existing) {
      onChange(
        selectedAddons.map((a) =>
          a.name === name ? { ...a, quantity: a.quantity + 1 } : a
        )
      );
    } else {
      onChange([...selectedAddons, { name, quantity: 1, price: defaultPrice }]);
    }
  };

  const updateQuantity = (name: string, delta: number) => {
    onChange(
      selectedAddons
        .map((a) => (a.name === name ? { ...a, quantity: a.quantity + delta } : a))
        .filter((a) => a.quantity > 0)
    );
  };

  const updatePrice = (name: string, price: number) => {
    onChange(
      selectedAddons.map((a) => (a.name === name ? { ...a, price } : a))
    );
  };

  const removeAddon = (name: string) => {
    onChange(selectedAddons.filter((a) => a.name !== name));
  };

  const addCustomAddon = () => {
    if (customAddon.name && customAddon.price) {
      const price = parseInt(customAddon.price);
      if (price > 0) {
        onChange([
          ...selectedAddons,
          { name: customAddon.name, quantity: 1, price },
        ]);
        setCustomAddon({ name: '', price: '' });
      }
    }
  };

  const total = selectedAddons.reduce((sum, a) => sum + a.quantity * a.price, 0);

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Add-Ons (Optional)</Label>
      
      {/* Predefined add-ons */}
      <div className="flex flex-wrap gap-2">
        {ADDON_OPTIONS.map((addon) => (
          <Button
            key={addon.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addAddon(addon.name, addon.defaultPrice)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            {addon.name} (₹{addon.defaultPrice})
          </Button>
        ))}
      </div>

      {/* Custom add-on */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Custom Item</Label>
          <Input
            placeholder="Item name"
            value={customAddon.name}
            onChange={(e) => setCustomAddon({ ...customAddon, name: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="w-20">
          <Label className="text-xs text-muted-foreground">Price</Label>
          <Input
            type="number"
            placeholder="₹"
            value={customAddon.price}
            onChange={(e) => setCustomAddon({ ...customAddon, price: e.target.value })}
            className="h-9"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={addCustomAddon}
          disabled={!customAddon.name || !customAddon.price}
          className="h-9"
        >
          Add
        </Button>
      </div>

      {/* Selected add-ons */}
      {selectedAddons.length > 0 && (
        <Card className="bg-secondary/30">
          <CardContent className="p-3 space-y-2">
            {selectedAddons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between gap-2 bg-background rounded-md p-2"
              >
                <span className="text-sm font-medium flex-1">{addon.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(addon.name, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{addon.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(addon.name, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">×</span>
                  <Input
                    type="number"
                    value={addon.price}
                    onChange={(e) => updatePrice(addon.name, parseInt(e.target.value) || 0)}
                    className="h-7 w-16 text-sm text-right"
                  />
                  <span className="text-sm font-medium w-14 text-right">
                    ₹{addon.quantity * addon.price}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeAddon(addon.name)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-sm font-medium">Add-ons Total:</span>
              <span className="text-sm font-bold text-primary">₹{total}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
