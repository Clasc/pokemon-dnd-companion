"use client";

import { Pokemon, TYPE_COLORS } from "../../types/pokemon";

interface AddPokemonFormProps {
  pokemon: Omit<Pokemon, "id">;
  setPokemon: (
    pokemon:
      | Omit<Pokemon, "id">
      | ((prev: Omit<Pokemon, "id">) => Omit<Pokemon, "id">),
  ) => void;
}

const InputField = ({
  label,
  type,
  value,
  onChange,
  name,
}: {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const AttributeFields = ({
  attributes,
  onChange,
}: {
  attributes: Pokemon["attributes"];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {Object.entries(attributes).map(([key, value]) => (
      <InputField
        key={key}
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        type="number"
        name={key}
        value={value}
        onChange={onChange}
      />
    ))}
  </div>
);

export default function AddPokemonForm({
  pokemon,
  setPokemon,
}: AddPokemonFormProps) {
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value, 10) || 0 : value;

    setPokemon((prev) => {
      const updatedPokemon = { ...prev, [name]: parsedValue };
      // Keep currentHP in sync with maxHP when maxHP changes
      if (name === "maxHP") {
        updatedPokemon.currentHP = parsedValue as number;
      }
      return updatedPokemon;
    });
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPokemon((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPokemon((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-6">
      {/* Section: Basic Info */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Name"
            type="text"
            name="name"
            value={pokemon.name}
            onChange={handleBasicChange}
          />
          <InputField
            label="Level"
            type="number"
            name="level"
            value={pokemon.level}
            onChange={handleBasicChange}
          />
          <InputField
            label="Max HP"
            type="number"
            name="maxHP"
            value={pokemon.maxHP}
            onChange={handleBasicChange}
          />
          <InputField
            label="Sprite (Emoji)"
            type="text"
            name="sprite"
            value={pokemon.sprite || ""}
            onChange={handleBasicChange}
          />
        </div>
      </div>

      {/* Section: Typing */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Typing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type1"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Primary Type
            </label>
            <select
              name="type1"
              id="type1"
              value={pokemon.type1}
              onChange={handleTypeChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Object.keys(TYPE_COLORS).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="type2"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Secondary Type (Optional)
            </label>
            <select
              name="type2"
              id="type2"
              value={pokemon.type2 || ""}
              onChange={handleTypeChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">None</option>
              {Object.keys(TYPE_COLORS).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Attributes */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Attributes</h3>
        <AttributeFields
          attributes={pokemon.attributes}
          onChange={handleAttributeChange}
        />
      </div>

      {/* Section: Experience */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Current XP"
            type="number"
            name="experience"
            value={pokemon.experience}
            onChange={handleBasicChange}
          />
          <InputField
            label="XP for Next Level"
            type="number"
            name="experienceToNext"
            value={pokemon.experienceToNext}
            onChange={handleBasicChange}
          />
        </div>
      </div>
    </form>
  );
}
