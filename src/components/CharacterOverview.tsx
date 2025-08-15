'use client';

import { Character } from '../types/character';

interface CharacterOverviewProps {
  character: Character;
  isEditing: boolean;
  onAttributeChange?: (attribute: keyof Character['attributes'], value: number) => void;
  onHPChange?: (type: 'current' | 'max', delta: number) => void;
}

export default function CharacterOverview({
  character,
  isEditing,
  onAttributeChange,
  onHPChange
}: CharacterOverviewProps) {
  const attributeNames: (keyof Character['attributes'])[] = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  const getAttributeDisplayName = (attr: string) => {
    switch (attr) {
      case 'strength': return 'Strength';
      case 'dexterity': return 'Dexterity';
      case 'constitution': return 'Constitution';
      case 'intelligence': return 'Intelligence';
      case 'wisdom': return 'Wisdom';
      case 'charisma': return 'Charisma';
      default: return attr;
    }
  };

  const getHPPercentage = () => {
    return character.maxHP > 0 ? (character.currentHP / character.maxHP) * 100 : 0;
  };

  const getHPColor = () => {
    const percentage = getHPPercentage();
    if (percentage > 60) return 'var(--accent-green)';
    if (percentage > 30) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  return (
    <div className="glass rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Character Overview</h2>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {character.level || 1}
          </span>
        </div>
      </div>

      {/* Character Name & Class */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {character.name || 'Unnamed Character'}
          </h3>
          <p className="text-gray-300 text-sm">
            Level {character.level} {character.class || 'Adventurer'}
          </p>
        </div>
      </div>

      {/* Attributes */}
      <div className="attributes-grid mb-6">
        {attributeNames.map((attr) => (
          <div key={attr} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-gray-300 text-sm md:text-base font-medium">
              {getAttributeDisplayName(attr)}
            </span>
            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <button
                    onClick={() => onAttributeChange?.(attr, character.attributes[attr] - 1)}
                    className="w-6 h-6 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                </>
              )}
              <div className="w-12 h-8 md:w-14 md:h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                <span className="text-white font-semibold text-sm md:text-base">
                  {character.attributes[attr]}
                </span>
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={() => onAttributeChange?.(attr, character.attributes[attr] + 1)}
                    className="w-6 h-6 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hit Points */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm md:text-base font-medium">Hit Points</span>
          <div className="flex items-center gap-2">
            {isEditing && (
              <>
                <button
                  onClick={() => onHPChange?.('current', -1)}
                  className="w-6 h-6 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => onHPChange?.('current', 1)}
                  className="w-6 h-6 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>

        {/* HP Bar */}
        <div className="w-full bg-gray-600/50 rounded-full h-3 md:h-4 overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${Math.min(100, getHPPercentage())}%`,
              backgroundColor: getHPColor(),
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs md:text-sm text-gray-400">
            {character.currentHP}/{character.maxHP}
          </div>
          {isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onHPChange?.('max', -1)}
                className="w-5 h-5 rounded bg-red-500/60 hover:bg-red-500/80 text-white text-xs font-bold transition-colors"
              >
                -
              </button>
              <span className="text-xs md:text-sm text-gray-400 px-1">Max</span>
              <button
                onClick={() => onHPChange?.('max', 1)}
                className="w-5 h-5 rounded bg-green-500/60 hover:bg-green-500/80 text-white text-xs font-bold transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
