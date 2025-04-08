import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ isLoading }) => {
  // Spinner animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.6, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    isLoading && (
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Spinner */}
        <motion.div
          className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full"
          variants={spinnerVariants}
          animate="animate"
        />
      </motion.div>
    )
  );
};

export default Loading;