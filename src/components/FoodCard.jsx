
import React from 'react';
import FavoriteStar from './FavoriteStar'; 

const getSafeName = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val._name || JSON.stringify(val);
  return fallback;
};

export default function FoodCard({ food, isFavorite, onClick, onToggleFavorite }) {
  return (
    <div
      className="relative bg-gray-50 rounded-xl shadow p-3 cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <FavoriteStar
        isFavorite={isFavorite}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="top-3 right-3"
      />

      <img
        src={food.image_url || 'https://via.placeholder.com/300x200?text=Food'}
        alt={food._name || food.name}
        className="w-full h-32 object-cover rounded-lg mb-2"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x200?text=Food';
        }}
      />

      <h5 className="text-lg font-semibold text-purple-700 truncate">
        {food._name || food.name}
      </h5>

      <p className="text-sm text-gray-600 italic line-clamp-1">
        {getSafeName(food.diet_type_name, 'No Diet')} |{' '}
        {getSafeName(food.cuisine_type_name, 'No Cuisine')} |{' '}
        {getSafeName(food.food_type_name, 'No Type')}
      </p>

      {food.calories > 0 && (
        <p className="text-sm text-amber-600 mt-1 font-medium">
          🔥 {food.calories} kcal
        </p>
      )}
    </div>
  );
}
