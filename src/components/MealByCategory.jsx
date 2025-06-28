import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import IngredientsModal from './modals/IngredientsModal';
import NutrientsModal from './modals/NutrientsModal';
import FoodCard from '../components/FoodCard';
import { normalizeFood } from '../utils/normalizeFood';

export default function MealByCategory() {
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDetail, setFoodDetail] = useState(null);
  const [loadingFoodDetail, setLoadingFoodDetail] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    const loadData = async () => {
      try {
        setLoading(true);
        const foodRes = await axios.get('http://localhost:8000/api/foods-by-category');
        setCategories(foodRes.data.data);

        if (storedToken) {
          const favRes = await axios.get('http://localhost:8000/api/favorites/ids', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          setFavoriteIds((favRes.data.ids || []).map((id) => Number(id)));
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchFoodDetail = async (id) => {
    setSelectedFood(true);
    setLoadingFoodDetail(true);
    setFoodDetail(null);
    try {
      const token = localStorage.getItem('token');
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

  const handleToggleFavorite = useCallback(async (foodId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Bạn cần đăng nhập để sử dụng tính năng yêu thích!');

    try {
      await axios.post(
        'http://localhost:8000/api/favorites/toggle',
        { food_id: foodId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavoriteIds((prev) => {
        const isFavorite = prev.includes(Number(foodId));
        return isFavorite
          ? prev.filter((id) => id !== Number(foodId))
          : [...prev, Number(foodId)];
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, []);

  const closeModal = () => {
    setSelectedFood(null);
    setShowNutrients(false);
    setFoodDetail(null);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin w-6 h-6 mx-auto text-purple-600 mb-2" />
        <p>Loading meals...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10 text-purple-900">
        Meal Catalog by Category
      </h2>

      {categories.map((category) => (
        <div key={category._id} className="mb-16">
          <h3 className="text-2xl font-semibold text-purple-800 mb-6">{category._name}</h3>
          {category.foods?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.foods.map((food) => {
                const normalized = normalizeFood(food);
                return (
                  <FoodCard
                    key={normalized._id}
                    food={normalized}
                    isFavorite={favoriteIds.includes(Number(normalized._id))}
                    onClick={() => fetchFoodDetail(normalized._id)}
                    onToggleFavorite={() => handleToggleFavorite(normalized._id)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">No foods available in this category.</p>
          )}
        </div>
      ))}

      <AnimatePresence>
        {selectedFood && (
          loadingFoodDetail || !foodDetail ? (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Loader2 className="animate-spin w-6 h-6 mx-auto text-purple-700 mb-2" />
                <p>Loading food detail...</p>
              </motion.div>
            </motion.div>
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
          )
        )}
      </AnimatePresence>
    </section>
  );
}
