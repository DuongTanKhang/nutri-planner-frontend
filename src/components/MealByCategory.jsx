import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import IngredientsModal from './modals/IngredientsModal';
import NutrientsModal from './modals/NutrientsModal';
import FoodCard from '../components/FoodCard';
import { normalizeFood } from '../utils/normalizeFood';
import { useUser } from '../contexts/UserContext';

export default function MealByCategory() {
  const { token } = useUser();
  const [categories, setCategories] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDetail, setFoodDetail] = useState(null);
  const [loadingFoodDetail, setLoadingFoodDetail] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    foodType: '',
    allergen: '',
  });

  useEffect(() => {
    console.log('Token used for API:', token);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [foodRes, typeRes, allergenRes] = await Promise.all([
          axios.get('http://localhost:8000/api/foods-by-category'),
          axios.get('http://localhost:8000/api/food-types'),
          axios.get('http://localhost:8000/api/allergens'),
        ]);

        setCategories(foodRes.data.data);
        setFoodTypes(typeRes.data.data || []);
        setAllergens(allergenRes.data || []); // Thường API trả data nằm trong data.data

        if (token) {
          const favRes = await axios.get('http://localhost:8000/api/favorites/ids', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavoriteIds((favRes.data.ids || []).map((id) => Number(id)));
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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

  const handleToggleFavorite = useCallback(
    async (foodId) => {
      if (!token) return alert('You must be logged in to favorite a food!');
      try {
        await axios.post(
          'http://localhost:8000/api/favorites/toggle',
          { food_id: foodId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavoriteIds((prev) =>
          prev.includes(Number(foodId))
            ? prev.filter((id) => id !== Number(foodId))
            : [...prev, Number(foodId)]
        );
      } catch (err) {
        console.error('Error toggling favorite:', err);
      }
    },
    [token]
  );

  const closeModal = () => {
    setSelectedFood(null);
    setShowNutrients(false);
    setFoodDetail(null);
  };

  const matchesSearch = (food) => {
    if (!searchTerm.trim()) return true;

    const keyword = searchTerm.toLowerCase();

    const nameMatch = food._name?.toLowerCase().includes(keyword);
    const dietMatch = food.diet_type?.toLowerCase().includes(keyword);

    const ingredientMatch = (food.ingredients || []).some((ing) =>
      ing._name?.toLowerCase().includes(keyword)
    );

    return nameMatch || dietMatch || ingredientMatch;
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

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <select
          className="p-2 border rounded"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat._name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.foodType}
          onChange={(e) => setFilters((prev) => ({ ...prev, foodType: e.target.value }))}
        >
          <option value="">All Food Types</option>
          {foodTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type._name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.allergen}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, allergen: parseInt(e.target.value) || '' }))
          }
        >
          <option value="">All Allergens</option>
          {allergens.map((a) => (
            <option key={a._id} value={a._id}>
              {a._name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Render categorized meals */}
      {categories.map((category) => {
        const filteredFoods = category.foods?.filter((food) => {
          const matchesCategory =
            !filters.category || Number(category._id) === Number(filters.category);
          const matchesFoodType = !filters.foodType || food._food_type_id === filters.foodType;
          const matchesAllergen =
            !filters.allergen ||
            !(food.allergens || []).some((a) => Number(a._id) === filters.allergen);
          const matchesKeyword = matchesSearch(food);
          return matchesCategory && matchesFoodType && matchesAllergen && matchesKeyword;
        });

        if (!filteredFoods || filteredFoods.length === 0) return null;

        return (
          <div key={category._id} className="mb-16">
            <h3 className="text-2xl font-semibold text-purple-800 mb-6">{category._name}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFoods.map((food) => {
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
          </div>
        );
      })}

      {/* Modals */}
      <AnimatePresence>
        {selectedFood &&
          (loadingFoodDetail || !foodDetail ? (
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
          ))}
      </AnimatePresence>
    </section>
  );
}
