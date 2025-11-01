import AppMain from "@/components/shared/AppMain";
import Link from "next/link";

const PokemonNotFound = () => {
  return (
    <AppMain title="Pokémon Not Found">
      <Link
        href="/pokemon"
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
      >
        Team
      </Link>
      <section className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <p className="text-gray-300">
          The Pokémon you are trying to edit no longer exists or the link is
          invalid.
        </p>
        <div>
          <Link
            href="/pokemon"
            className="inline-block px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Back to Team
          </Link>
        </div>
      </section>
    </AppMain>
  );
};

export default PokemonNotFound;
