import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: "Elevate your everyday look with our stylish shirts.",
    description: " ",
    imageUrl:"https://res.cloudinary.com/dx2dvybl9/image/upload/v1741501862/vmqshkcg7rw5dwdpkb7l.jpg",
    imageAlt: "Elevate your everyday look with our stylish shirts."
  },
  {
    title: "lassic pants designed for comfort and style.",
    description: " ",
    imageUrl: "https://assets.ajio.com/medias/sys_master/root/20241112/LIuo/67338e16260f9c41e8d55613/-1117Wx1400H-700729505-grey-MODEL.jpg",
    imageAlt: "lassic pants designed for comfort and style."
  },
  {
    title: "Stay cool and casual with our premium T-shirts.",
    description: " ",
    imageUrl: "https://assets.ajio.com/medias/sys_master/root/20230703/zEjF/64a2f7b8eebac147fc48ac61/-1117Wx1400H-466325670-purple-MODEL.jpg",
    imageAlt: "Stay cool and casual with our premium T-shirts.",
  },
  {
    title: "Move freely and comfortably in our track pants.",
    description: " ",
    imageUrl: "https://assets.ajio.com/medias/sys_master/root/20220125/NdPb/61ef13c0aeb2695cdd2bb6b8/-473Wx593H-441128505-jetblack-MODEL.jpg",
    imageAlt: "Move freely and comfortably in our track pants."
  },
];

const HeroSlide = ({ data, direction }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'right' ? -300 : 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction === 'right' ? 300 : -300 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="m-auto md:h-full flex flex-wrap items-center justify-center gap-10 w-full"
  >
    <div className="max-w-xl mx-auto">
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900"
      >
        {data.title}
      </motion.h2>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 text-gray-700 text-center"
      >
        {data.description}
      </motion.p>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-4"
      >
        
      </motion.div>
    </div>
    <motion.img
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      src={data.imageUrl}
      alt={data.imageAlt}
      className="min-w-64 h-64 md:h-96 bg-slate-50 rounded-md object-contain mx-auto"
    />
  </motion.div>
);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('left');
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-white text-gray-900 py-10 md:py-20 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className=" mx-auto px-4">
        <AnimatePresence mode="wait">
          <HeroSlide key={currentIndex} data={slides[currentIndex]} direction={direction} />
        </AnimatePresence>
      </div>
      <button
        onClick={() => {
          prevSlide();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      <button
        onClick={() => {
          nextSlide();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-gray-900' : 'bg-gray-500'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default Hero;
