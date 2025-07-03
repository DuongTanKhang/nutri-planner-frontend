import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import IngredientsModal from './modals/IngredientsModal';
import FoodCard from '../components/FoodCard';
import { normalizeFood } from '../utils/normalizeFood';
import { useUser } from '../contexts/UserContext';
import LoadingOverlay from './LoadingOverlay';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    foodType: '',
    allergen: '',
  });
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(3);
  const [filterLoading, setFilterLoading] = useState(false);

  // Thời gian hết hạn cache: 1 tiếng (ms)
  const CACHE_EXPIRE = 3600 * 1000;

  // Hàm fetchData tách riêng để gọi lại khi cần
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
      setAllergens(allergenRes.data || []);

      // Lưu cache
      localStorage.setItem('mealByCategoryCache', JSON.stringify({
        categories: foodRes.data.data,
        foodTypes: typeRes.data.data || [],
        allergens: allergenRes.data || [],
        timestamp: Date.now()
      }));

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

  useEffect(() => {
    // Kiểm tra cache trước khi fetch
    const cache = localStorage.getItem('mealByCategoryCache');
    if (cache) {
      const data = JSON.parse(cache);
      if (Date.now() - data.timestamp < CACHE_EXPIRE) {
        setCategories(data.categories);
        setFoodTypes(data.foodTypes);
        setAllergens(data.allergens);
        setLoading(false);
        // Vẫn cần fetch favorite nếu đã đăng nhập
        if (token) {
          axios.get('http://localhost:8000/api/favorites/ids', {
            headers: { Authorization: `Bearer ${token}` },
          }).then(favRes => {
            setFavoriteIds((favRes.data.ids || []).map((id) => Number(id)));
          }).catch(err => {
            console.error('Error loading favorites:', err);
          });
        }
        return;
      }
    }
    // Nếu không có cache hoặc cache hết hạn, fetch lại
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
    setFoodDetail(null);
  };

  const filteredFoodsByCategory = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const result = new Map();

    categories.forEach((category) => {
      const matchedFoods = (category.foods || []).filter((food) => {
        const matchesCategory = !filters.category || String(category._id) === filters.category;
        const matchesFoodType = !filters.foodType || food._food_type_id === filters.foodType;
        const matchesAllergen =
          !filters.allergen ||
          !(food.allergens || []).some((a) => Number(a._id) === Number(filters.allergen));
        const matchesKeyword =
          !keyword ||
          food._name?.toLowerCase().includes(keyword) ||
          food.diet_type?.toLowerCase().includes(keyword) ||
          (food.ingredients || []).some((ing) => ing._name?.toLowerCase().includes(keyword));

        return matchesCategory && matchesFoodType && matchesAllergen && matchesKeyword;
      });

      if (matchedFoods.length > 0) {
        result.set(category._id, { ...category, foods: matchedFoods });
      }
    });

    return result;
  }, [categories, filters, searchTerm]);

  // Helper to handle filter change with loading overlay
  const handleFilterChange = (updateFn) => (e) => {
    setFilterLoading(true);
    updateFn(e);
    setTimeout(() => setFilterLoading(false), 500);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin w-6 h-6 mx-auto text-purple-600 mb-2" />
        <p>Loading meals...</p>
      </div>
    );
  }

  const categoryArray = Array.from(filteredFoodsByCategory.values());
  const visibleCategories = categoryArray.slice(0, visibleCategoryCount);
  const hasMore = visibleCategoryCount < categoryArray.length;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {filterLoading && <LoadingOverlay />}
      <h2 className="text-3xl font-bold text-center mb-10 text-white">
        Meal Catalog by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <select
          className="p-2 border rounded"
          value={filters.category}
          onChange={handleFilterChange((e) => setFilters((prev) => ({ ...prev, category: e.target.value })))}
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
          onChange={handleFilterChange((e) => setFilters((prev) => ({ ...prev, foodType: e.target.value })))}
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
          onChange={handleFilterChange((e) => setFilters((prev) => ({ ...prev, allergen: parseInt(e.target.value) || '' })))}
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
          onChange={handleFilterChange((e) => setSearchTerm(e.target.value))}
          className="p-2 border rounded w-full"
        />
      </div>

      {visibleCategories.map((category) => (
        <div key={category._id} className="mb-16">
          <h3 className="text-2xl font-semibold text-purple-800 mb-6">{category._name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
        </div>
      ))}

      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCategoryCount((prev) => prev + 3)}
            className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Load more categories
          </button>
        </div>
      )}

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
          ) : (
            <IngredientsModal
              food={foodDetail}
              loading={loadingFoodDetail}
              onClose={closeModal}
              nutrients={foodDetail.nutrients || []}
            />
          )
        )}
      </AnimatePresence>
    </section>
  );
}
