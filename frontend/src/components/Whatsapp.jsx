import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import Cookies from 'js-cookie';
import LeaderLine from 'leader-line-new'; // Correct import

const WhatsAppGuide = () => {
  const whatsappNumber = "+919160227573"; // Replace with your actual number
  const whatsappMessage = "Hello! I need assistance.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const [showGuide, setShowGuide] = useState(false);
  const guideRef = useRef(null); // Ref for guide box
  const buttonRef = useRef(null); // Ref for WhatsApp button
  const lineRef = useRef(null); // Ref to store LeaderLine instance

  // Check if it's the user's first visit
  useEffect(() => {
    const hasSeenGuide = Cookies.get('hasSeenWhatsAppGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  // Handle OK button click
  const handleDismiss = () => {
    setShowGuide(false);
    Cookies.set("hasSeenWhatsAppGuide", "true", { expires: 60 }); // Set cookie for 60 days
    if (lineRef.current) {
      lineRef.current.remove(); 
    }
  };

  // Draw the line when guide is shown
  useEffect(() => {
    if (showGuide && guideRef.current && buttonRef.current) {
      lineRef.current = new LeaderLine({
        start: guideRef.current,
        end: buttonRef.current,
        color: '#000', // White color
        size: 2,
        dash: { len: 5, gap: 5 },
        path: 'arc',
      });
    }
    
    // return () => {
    //   if (lineRef.current) {
    //     lineRef.current.remove();
    //   }
    // };
  }, [showGuide]);
  

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.8, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const guideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.5 },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: { duration: 1, repeat: Infinity },
    },
    hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.95 },
  };

  return (
    <>
      {/* WhatsApp Button */}
      <motion.a
        ref={buttonRef} // Add ref for LeaderLine
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
        variants={buttonVariants}
        initial="hidden"
        animate={showGuide ? ['visible', 'pulse'] : 'visible'}
        whileHover="hover"
        whileTap="tap"
      >
        <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.a>

      {/* Overlay and Guide */}
      <AnimatePresence>
        {showGuide && (
          <>
            {/* Black Transparency Overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            {/* Guide Box */}
            <motion.div
              ref={guideRef} // Add ref for LeaderLine
              className="fixed bottom-16 right-4 sm:bottom-20 sm:right-20 bg-white p-4 sm:p-6 rounded-lg shadow-lg z-50 w-11/12 sm:max-w-xs text-center"
              variants={guideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-base sm:text-lg font-semibold mb-2">
                Need Help? Contact us on WhatsApp!
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Click the green button for instant support.
              </p>

              {/* OK Button */}
              <button
                onClick={handleDismiss}
                className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-gray-800"
              >
                OK
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppGuide;