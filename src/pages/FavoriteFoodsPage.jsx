import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import IngredientsModal from '../components/modals/IngredientsModal';
import NutrientsModal from '../components/modals/NutrientsModal';
import { normalizeFood } from '../utils/normalizeFood';
import { AnimatePresence } from 'framer-motion';

export default function FavoriteFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDetail, setFoodDetail] = useState(null);
  const [loadingFoodDetail, setLoadingFoodDetail] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);

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

  const fetchFoodDetail = async (id) => {
    setSelectedFood(true);
    setLoadingFoodDetail(true);
    setFoodDetail(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodDetail(res.data.data);
    } catch (err) {
      console.error('Error loading food detail:', err);
    } finally {
      setLoadingFoodDetail(false);
    }
  };

  const closeModal = () => {
    setSelectedFood(null);
    setShowNutrients(false);
    setFoodDetail(null);
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
                onClick={() => fetchFoodDetail(normalized._id)}
                onToggleFavorite={() => handleToggleFavorite(normalized._id)}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedFood &&
          (loadingFoodDetail || !foodDetail ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow text-center max-w-md w-full">
                <Loader2 className="animate-spin w-6 h-6 mx-auto text-purple-700 mb-2" />
                <p>Loading food detail...</p>
              </div>
            </div>
          ) : showNutrients ? (
            <NutrientsModal
              nutrients={foodDetail.nutrients}
              foodName={foodDetail.name}
              onClose={closeModal}
              onBack={() => setShowNutrients(false)}
            />
          ) : (
            <IngredientsModal
              food={foodDetail}
              loading={loadingFoodDetail}
              onClose={closeModal}
              onShowNutrient={() => setShowNutrients(true)}
            />
          ))}
      </AnimatePresence>
    </section>
  );
}
