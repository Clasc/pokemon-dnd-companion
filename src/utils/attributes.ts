import { Attributes } from "@/types/pokemon";

export const ATTRIBUTE_NAMES: (keyof Attributes)[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const SHORT_NAMES: Record<keyof Attributes, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

const DISPLAY_NAMES: Record<keyof Attributes, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
};

export function getAttributeShortName(attr: keyof Attributes): string {
  return SHORT_NAMES[attr];
}

export function getAttributeDisplayName(attr: keyof Attributes): string {
  return DISPLAY_NAMES[attr];
}

export function getAttributeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
