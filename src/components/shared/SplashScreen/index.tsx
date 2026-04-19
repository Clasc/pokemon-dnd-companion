"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store";

const pokemonLogo = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";

const MIN_SPLASH_DURATION = 400;

const SplashScreen = () => {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (hasHydrated && showSplash) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setShowSplash(false), 300);
      }, MIN_SPLASH_DURATION);
      return () => clearTimeout(timer);
    }
  }, [hasHydrated, showSplash]);

  if (!showSplash) return null;

  return (
    <div className={`splash-screen ${isExiting ? "exiting" : ""}`}>
      <div className="splash-content">
        <img
          src={pokemonLogo}
          alt="Pikachu"
          className="splash-logo animate-bounce"
        />
        <h1 className="splash-title">Pokémon D&D</h1>
        <p className="splash-subtitle">Companion</p>
        {!hasHydrated && <div className="splash-spinner" />}
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          animation: fadeIn 0.2s ease-out;
        }

        .splash-screen.exiting {
          animation: fadeOut 0.3s ease-out forwards, zoomOut 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes zoomOut {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .splash-logo {
          width: 96px;
          height: 96px;
          filter: drop-shadow(0 0 20px rgba(238, 93, 32, 0.6));
        }

        .splash-title {
          font-family: var(--font-poppins, "Poppins", sans-serif);
          font-size: 2.5rem;
          font-weight: 700;
          color: #f0f0f0;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .splash-subtitle {
          font-family: var(--font-inter, "Inter", sans-serif);
          font-size: 1.25rem;
          color: #a0a0a0;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.3em;
        }

        .splash-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #ee5d20;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-top: 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        @media (max-width: 480px) {
          .splash-logo { width: 72px; height: 72px; }
          .splash-title { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;