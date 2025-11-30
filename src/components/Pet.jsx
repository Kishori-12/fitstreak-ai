import { motion } from 'framer-motion';

const Pet = ({ state, message }) => {
  const getPetEmoji = () => {
    switch (state) {
      case 'super-happy': return '🐱✨';
      case 'happy': return '😸';
      case 'sad': return '😿';
      case 'sick': return '👻';
      default: return '😸';
    }
  };

  const getPetAnimation = () => {
    switch (state) {
      case 'super-happy': return { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] };
      case 'happy': return { scale: [1, 1.1, 1] };
      case 'sad': return { y: [0, 5, 0] };
      case 'sick': return { opacity: [1, 0.5, 1] };
      default: return {};
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="text-8xl"
        animate={getPetAnimation()}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {getPetEmoji()}
      </motion.div>
      
      <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs relative">
        <div className="absolute -top-2 left-8 w-4 h-4 bg-white transform rotate-45"></div>
        <p className="text-gray-800 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Pet;