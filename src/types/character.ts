export interface DnDAttributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  name: string;
  level: number;
  class: string;
  attributes: DnDAttributes;
  currentHP: number;
  maxHP: number;
}

export const DEFAULT_ATTRIBUTES: DnDAttributes = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

export const DEFAULT_CHARACTER: Character = {
  name: "",
  level: 1,
  class: "",
  attributes: DEFAULT_ATTRIBUTES,
  currentHP: 0,
  maxHP: 0,
};
