import { FaStar, FaRegStar } from 'react-icons/fa';

export default function FavoriteStar({ isFavorite, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`absolute z-10 ${className || ''}`}
      aria-label="Favorite"
      type="button"
    >
      {isFavorite ? (
        <FaStar className="text-yellow-400 text-2xl drop-shadow" />
      ) : (
        <FaRegStar className="text-gray-300 text-2xl" />
      )}
    </button>
  );
}
