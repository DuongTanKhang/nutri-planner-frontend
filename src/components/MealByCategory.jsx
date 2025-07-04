import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodTypesLoading, setFoodTypesLoading] = useState(true);
  const [allergens, setAllergens] = useState([]);
  const [allergensLoading, setAllergensLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDetail, setFoodDetail] = useState(null);
  const [loadingFoodDetail, setLoadingFoodDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    foodType: '',
    allergens: [],
  });
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(3);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showAllergenDropdown, setShowAllergenDropdown] = useState(false);
  const allergenDropdownRef = useRef(null);

  const CACHE_EXPIRE = 3600 * 1000;

 
  useEffect(() => {
    const cache = localStorage.getItem('mealByCategoryCache');
    if (cache) {
      const data = JSON.parse(cache);
      if (Date.now() - data.timestamp < CACHE_EXPIRE) {
        setCategories(data.categories);
        setCategoriesLoading(false);
        setFoodTypes(data.foodTypes);
        setFoodTypesLoading(false);
        setAllergens(data.allergens);
        setAllergensLoading(false);
        return;
      }
    }
    // Fetch categories
    setCategoriesLoading(true);
    axios.get('http://localhost:8000/api/foods-by-category')
      .then(res => {
        setCategories(res.data.data);
        setCategoriesLoading(false);
        // Save partial cache
        localStorage.setItem('mealByCategoryCache', JSON.stringify({
          categories: res.data.data,
          foodTypes: [],
          allergens: [],
          timestamp: Date.now()
        }));
      })
      .catch(err => {
        setCategories([]);
        setCategoriesLoading(false);
        console.error('Error loading categories:', err);
      });
  }, []);

  // Load foodTypes
  useEffect(() => {
    const cache = localStorage.getItem('mealByCategoryCache');
    if (cache) {
      const data = JSON.parse(cache);
      if (Date.now() - data.timestamp < CACHE_EXPIRE && data.foodTypes?.length) {
        setFoodTypes(data.foodTypes);
        setFoodTypesLoading(false);
        return;
      }
    }
    setFoodTypesLoading(true);
    axios.get('http://localhost:8000/api/food-types')
      .then(res => {
        setFoodTypes(res.data.data || []);
        setFoodTypesLoading(false);
        // Update cache
        const cache = localStorage.getItem('mealByCategoryCache');
        if (cache) {
          const data = JSON.parse(cache);
          localStorage.setItem('mealByCategoryCache', JSON.stringify({
            ...data,
            foodTypes: res.data.data || [],
            timestamp: Date.now()
          }));
        }
      })
      .catch(err => {
        setFoodTypes([]);
        setFoodTypesLoading(false);
        console.error('Error loading food types:', err);
      });
  }, []);

  // Load allergens
  useEffect(() => {
    const cache = localStorage.getItem('mealByCategoryCache');
    if (cache) {
      const data = JSON.parse(cache);
      if (Date.now() - data.timestamp < CACHE_EXPIRE && data.allergens?.length) {
        setAllergens(data.allergens);
        setAllergensLoading(false);
        return;
      }
    }
    setAllergensLoading(true);
    axios.get('http://localhost:8000/api/allergens')
      .then(res => {
        setAllergens(res.data || []);
        setAllergensLoading(false);
        // Update cache
        const cache = localStorage.getItem('mealByCategoryCache');
        if (cache) {
          const data = JSON.parse(cache);
          localStorage.setItem('mealByCategoryCache', JSON.stringify({
            ...data,
            allergens: res.data || [],
            timestamp: Date.now()
          }));
        }
      })
      .catch(err => {
        setAllergens([]);
        setAllergensLoading(false);
        console.error('Error loading allergens:', err);
      });
  }, []);

  // Load favoriteIds (only if logged in)
  useEffect(() => {
    if (!token) {
      setFavoriteIds([]);
      setFavoriteLoading(false);
      return;
    }
    setFavoriteLoading(true);
    axios.get('http://localhost:8000/api/favorites/ids', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(favRes => {
        setFavoriteIds((favRes.data.ids || []).map((id) => Number(id)));
        setFavoriteLoading(false);
      })
      .catch(err => {
        setFavoriteIds([]);
        setFavoriteLoading(false);
        console.error('Error loading favorites:', err);
      });
  }, [token]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!showAllergenDropdown) return;
    function handleClickOutside(event) {
      if (allergenDropdownRef.current && !allergenDropdownRef.current.contains(event.target)) {
        setShowAllergenDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAllergenDropdown]);

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
          !filters.allergens.length ||
          !(food.allergens || []).some((a) => filters.allergens.includes(Number(a._id)));
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

  // If categories are still loading, show loader for main content
  if (categoriesLoading) {
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
          disabled={categoriesLoading}
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
          disabled={foodTypesLoading}
        >
          <option value="">All Food Types</option>
          {foodTypesLoading ? (
            <option disabled>Loading...</option>
          ) : (
            foodTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type._name}
              </option>
            ))
          )}
        </select>

        {/* Custom allergens dropdown */}
        <div className="relative" ref={allergenDropdownRef}>
          <button
            type="button"
            className="p-2 border rounded w-full text-left bg-white flex justify-between items-center"
            onClick={() => setShowAllergenDropdown((prev) => !prev)}
            disabled={allergensLoading}
          >
            <span className={filters.allergens.length === 0 ? 'text-gray-400' : ''}>
              {filters.allergens.length === 0
                ? 'Select allergens'
                : `${filters.allergens.length} selected`}
            </span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAllergenDropdown && !allergensLoading && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
              {allergens.map((a) => (
                <label key={a._id} className="flex items-center px-3 py-2 hover:bg-purple-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.allergens.includes(Number(a._id))}
                    onChange={() => {
                      setFilters((prev) => {
                        const exists = prev.allergens.includes(Number(a._id));
                        return {
                          ...prev,
                          allergens: exists
                            ? prev.allergens.filter(id => id !== Number(a._id))
                            : [...prev.allergens, Number(a._id)]
                        };
                      });
                    }}
                    className="mr-2"
                  />
                  {a._name}
                </label>
              ))}
              {allergens.length === 0 && (
                <div className="px-3 py-2 text-gray-400">No allergens</div>
              )}
            </div>
          )}
          {allergensLoading && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow px-3 py-2 text-gray-400">
              Loading...
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={handleFilterChange((e) => setSearchTerm(e.target.value))}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Selected allergens as tags */}
      {filters.allergens.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.allergens.map((id) => {
            const allergen = allergens.find(a => Number(a._id) === Number(id));
            return (
              <span key={id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center text-sm">
                {allergen ? allergen._name : id}
                <button
                  className="ml-2 text-purple-600 hover:text-purple-900"
                  onClick={() => setFilters((prev) => ({
                    ...prev,
                    allergens: prev.allergens.filter(aid => aid !== id)
                  }))}
                  aria-label="Remove allergen"
                  type="button"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

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
                  favoriteLoading={favoriteLoading}
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
