import { useEffect, useRef, useState } from "react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

export default function ActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(e);
    setIsMenuOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(e);
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuToggle}
        className="w-8 h-8 rounded-lg bg-gray-500/20 hover:bg-gray-500/40 transition-colors flex items-center justify-center group"
        title="Actions"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="absolute top-10 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 w-40">
          <ul className="py-1">
            <li>
              <EditButton onClick={handleEditClick} />
            </li>
            <li>
              <DeleteButton onClick={handleDeleteClick} />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
