"use client";

import AppMain from "@/components/shared/AppMain";
import Pokedollars from "@/components/shared/Pokedollars";
import TrainerInventory from "@/features/trainer/components/TrainerInventory";
import { useAppStore } from "@/store";
import { InventoryItem } from "@/types/trainer";

const InventoryPage = () => {
  const trainer = useAppStore().trainer;
  const setTrainer = useAppStore().setTrainer;

  if (!trainer) return null;

  const handleUseItem = (itemId: string) => {
    const updatedInventory = trainer.inventory
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setTrainer({ ...trainer, inventory: updatedInventory });
  };

  const handleAddItem = (newItem: Omit<InventoryItem, "id">) => {
    const itemWithId: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
    };

    setTrainer({
      ...trainer,
      inventory: [...(trainer.inventory || []), itemWithId],
    });
  };

  const handleUpdatePokedollars = (newAmount: number) => {
    setTrainer({
      ...trainer,
      pokedollars: newAmount,
    });
  };

  const handleIncreaseItem = (itemId: string) => {
    const currentInventory = trainer.inventory || [];
    const updatedInventory = currentInventory.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setTrainer({ ...trainer, inventory: updatedInventory });
  };

  return (
    <AppMain title="Inventory">
      <Pokedollars
        pokedollars={trainer.pokedollars || 0}
        isEditable
        onPokedollarChange={handleUpdatePokedollars}
      />

      <TrainerInventory
        inventory={trainer.inventory || []}
        onUseItem={handleUseItem}
        onAddItem={handleAddItem}
        onIncreaseItem={handleIncreaseItem}
        isEditable={true}
      />
    </AppMain>
  );
};

export default InventoryPage;
