import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { normalizeFood } from '../utils/normalizeFood';

export default function FavoriteFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoods(res.data.data);
      } catch (err) {
        console.error('Failed to fetch favorite foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleToggleFavorite = async (foodId) => {
    try {
      await axios.post(
        'http://localhost:8000/api/favorites/toggle',
        { food_id: foodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoods((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin w-6 h-6 mx-auto text-purple-600 mb-2" />
        <p>Loading favorite foods...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">
        Your Favorite Foods
      </h1>

      {foods.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          You haven't added any favorite foods yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => {
            const normalized = normalizeFood(food);
            return (
              <FoodCard
                key={normalized._id}
                food={normalized}
                isFavorite={true}
                onClick={() => {}}
                onToggleFavorite={() => handleToggleFavorite(normalized._id)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
