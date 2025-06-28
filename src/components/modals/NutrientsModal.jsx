import React from 'react';
import { motion } from 'framer-motion';

export default function NutrientsModal({ nutrients, foodName, onClose, onBack }) {
  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">
          ×
        </button>

        <h2 className="text-xl font-bold text-purple-700 mb-4">Nutrients of {foodName}</h2>

        {nutrients.length === 0 ? (
          <p className="text-sm text-gray-500">No nutrient data available.</p>
        ) : (
          <ul className="space-y-2 text-gray-700 text-sm">
            {nutrients.map((n, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{n.name} ({n.group})</span>
                <span className="font-semibold text-purple-700">{n.value} {n.unit}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onBack}
          className="mt-5 inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ← Back to Ingredients
        </button>
      </motion.div>
    </motion.div>
  );
}
