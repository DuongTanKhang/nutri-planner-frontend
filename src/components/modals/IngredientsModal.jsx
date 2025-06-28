import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, XCircle } from 'lucide-react';

export default function IngredientsModal({ food, loading, onClose, onShowNutrient }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          aria-label="Close"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 text-purple-700 font-medium">
            <Loader2 className="animate-spin w-6 h-6 mb-3" />
            Loading food detail...
          </div>
        ) : (
          <>
            <div className="rounded overflow-hidden mb-4 aspect-[4/3]">
              <img src={food.image} alt={food.name} className="w-full h-full object-cover rounded" />
            </div>

            <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">{food.name}</h2>

            <ul className="space-y-3 text-gray-700 text-sm">
              {food.ingredients.map((ing, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="font-medium">{ing.name} – {ing.amount}g</div>
                  <div className="text-sm text-gray-600">Preparation: {ing.preparation}</div>
                  {ing.is_allergen && (
                    <div className="text-red-600 text-xs mt-1">
                      ⚠ <strong>Allergen:</strong> {ing.allergen}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={onShowNutrient}
              className="mt-6 w-full px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition text-sm font-medium"
            >
              View Nutrients
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
