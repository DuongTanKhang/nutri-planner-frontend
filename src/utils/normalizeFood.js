// src/utils/normalizeFood.js
export const normalizeFood = (food) => ({
  ...food,
  diet_type_name: food.diet_type_name || food.diet_type || 'No Diet',
  cuisine_type_name: food.cuisine_type_name || food.cuisine_type || 'No Cuisine',
  food_type_name: food.food_type_name || food.food_type || 'No Type',
  image_url: food.image_url || food.first_image_url || '',
  calories: parseFloat(food.calories || 0),
});
