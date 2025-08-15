'use client';

import CharacterForm from '../components/CharacterForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Pokémon D&D Companion
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your character and Pokémon team
          </p>
        </header>

        <main>
          <CharacterForm />
        </main>
      </div>
    </div>
  );
}
