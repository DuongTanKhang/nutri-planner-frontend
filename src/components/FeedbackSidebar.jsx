import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FeedbackForm from './FeedbackForm';
import { MessageCircle } from 'lucide-react';

const FeedbackSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar Button */}
      <div className="fixed middle top-1/2 z-40 -translate-y-1/2 m-0 p-0" style={{ right: 17 , top: 400}}>
        <button
          className="bg-blue-600 text-white py-1 px-1 rounded-lg shadow-lg flex flex-row items-center gap-1 hover:bg-purple-700 transition border-0"
          onClick={() => setOpen(true)}
          style={{ transform: 'rotate(270deg)', transformOrigin: 'right center', marginRight: 0, paddingRight: 0 }}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold tracking-wider text-base">Feedback <span className="text-xs">{" "} </span></span>
        </button>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white shadow-2xl w-full max-w-md h-full p-0 flex flex-col relative"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold z-10"
                onClick={() => setOpen(false)}
                aria-label="Close feedback form"
              >
                &times;
              </button>
              <div className="overflow-y-auto h-full p-6">
                <FeedbackForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackSidebar; 