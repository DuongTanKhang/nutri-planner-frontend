export const normalizeFood = (food) => {
  const allergens = Array.isArray(food.allergens)
    ? food.allergens.map((a) =>
        typeof a === 'object' ? a : { _id: a, _name: '' }
      )
    : [];

  return {
    ...food,
    allergens,
    diet_type_name: food.diet_type_name || food.diet_type || 'No Diet',
    cuisine_type_name: food.cuisine_type_name || food.cuisine_type || 'No Cuisine',
    food_type_name: food.food_type_name || food.food_type || 'No Type',
    image_url: food.image_url || food.first_image_url || '',
    calories: parseFloat(food.calories || 0),
  };
};
