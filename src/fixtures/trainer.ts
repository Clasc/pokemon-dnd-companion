import { Trainer } from "@/types/trainer";

export const testTrainer: Trainer = {
  name: "Ash Ketchum",
  level: 5,
  class: "Pokemon Trainer",
  attributes: {
    strength: 12,
    dexterity: 14,
    constitution: 13,
    intelligence: 11,
    wisdom: 15,
    charisma: 16,
  },
  currentHP: 45,
  maxHP: 45,
  inventory: [
    {
      id: "1",
      name: "Pokeball",
      quantity: 10,
      description: "A standard Pokeball for catching Pokemon",
    },
    {
      id: "2",
      name: "Great Ball",
      quantity: 5,
      description: "A better Pokeball with higher catch rate",
    },
    {
      id: "3",
      name: "Potion",
      quantity: 3,
      description: "Restores 20 HP to a Pokemon",
    },
    {
      id: "4",
      name: "Super Potion",
      quantity: 2,
      description: "Restores 50 HP to a Pokemon",
    },
    {
      id: "5",
      name: "Oran Berry",
      quantity: 8,
      description: "A berry that restores 10 HP when eaten",
    },
    {
      id: "6",
      name: "Revive",
      quantity: 1,
      description: "Revives a fainted Pokemon with half HP",
    },
  ],
  pokedollars: 2500,
};
