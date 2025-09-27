import { testFixtures, testTrainer, testPokemon } from "../index";

describe("Test Fixtures", () => {
  describe("testTrainer", () => {
    it("should have valid trainer data", () => {
      expect(testTrainer.name).toBe("Ash Ketchum");
      expect(testTrainer.level).toBe(5);
      expect(testTrainer.class).toBe("Pokemon Trainer");
      expect(testTrainer.currentHP).toBe(45);
      expect(testTrainer.maxHP).toBe(45);
      expect(testTrainer.pokedollars).toBe(2500);
    });

    it("should have valid attributes", () => {
      expect(testTrainer.attributes.strength).toBe(12);
      expect(testTrainer.attributes.dexterity).toBe(14);
      expect(testTrainer.attributes.constitution).toBe(13);
      expect(testTrainer.attributes.intelligence).toBe(11);
      expect(testTrainer.attributes.wisdom).toBe(15);
      expect(testTrainer.attributes.charisma).toBe(16);
    });

    it("should have inventory items", () => {
      expect(testTrainer.inventory).toHaveLength(6);
      expect(testTrainer.inventory[0].name).toBe("Pokeball");
      expect(testTrainer.inventory[0].quantity).toBe(10);
      expect(testTrainer.inventory[2].name).toBe("Potion");
      expect(testTrainer.inventory[2].description).toBe(
        "Restores 20 HP to a Pokemon",
      );
    });
  });

  describe("testPokemon", () => {
    it("should have 3 pokemon", () => {
      const pokemonKeys = Object.keys(testPokemon);
      expect(pokemonKeys).toHaveLength(3);
      expect(pokemonKeys).toContain("pikachu-001");
      expect(pokemonKeys).toContain("charizard-002");
      expect(pokemonKeys).toContain("bulbasaur-003");
    });

    it("should have valid Pikachu data", () => {
      const pikachu = testPokemon["pikachu-001"];
      expect(pikachu.name).toBe("Sparky");
      expect(pikachu.type).toBe("Pikachu");
      expect(pikachu.type1).toBe("electric");
      expect(pikachu.type2).toBeUndefined();
      expect(pikachu.level).toBe(12);
      expect(pikachu.currentHP).toBe(42);
      expect(pikachu.maxHP).toBe(42);
      expect(pikachu.attacks).toHaveLength(3);
      expect(pikachu.attacks[0].name).toBe("Thunder Shock");
    });

    it("should have valid Charizard data", () => {
      const charizard = testPokemon["charizard-002"];
      expect(charizard.name).toBe("Blaze");
      expect(charizard.type).toBe("Charizard");
      expect(charizard.type1).toBe("fire");
      expect(charizard.type2).toBe("flying");
      expect(charizard.level).toBe(18);
      expect(charizard.attacks).toHaveLength(4);
      expect(charizard.primaryStatus).toBeUndefined();
    });

    it("should have valid Bulbasaur data with status condition", () => {
      const bulbasaur = testPokemon["bulbasaur-003"];
      expect(bulbasaur.name).toBe("Ivy");
      expect(bulbasaur.type).toBe("Bulbasaur");
      expect(bulbasaur.type1).toBe("grass");
      expect(bulbasaur.type2).toBe("poison");
      expect(bulbasaur.level).toBe(8);
      expect(bulbasaur.currentHP).toBe(15);
      expect(bulbasaur.maxHP).toBe(32);
      expect(bulbasaur.attacks).toHaveLength(3);
      expect(bulbasaur.primaryStatus?.condition).toBe("poisoned");
      expect(bulbasaur.primaryStatus?.duration).toBe(3);
    });

    it("should have valid attack data for all pokemon", () => {
      Object.values(testPokemon).forEach((pokemon) => {
        pokemon.attacks.forEach((attack) => {
          expect(attack.name).toBeTruthy();
          expect(attack.currentPp).toBeGreaterThanOrEqual(0);
          expect(attack.maxPp).toBeGreaterThan(0);
          expect(attack.currentPp).toBeLessThanOrEqual(attack.maxPp);
          expect(["action", "bonus action"]).toContain(attack.actionType);
          expect(typeof attack.moveBonus).toBe("number");
        });
      });
    });
  });

  describe("testFixtures", () => {
    it("should export combined fixtures", () => {
      expect(testFixtures.trainer).toEqual(testTrainer);
      expect(testFixtures.pokemonTeam).toEqual(testPokemon);
    });
  });
});
