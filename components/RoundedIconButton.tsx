// File path: components/RoundedIconButton.tsx
// components/RoundedIconButton.tsx
"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface RoundedIconButtonProps {
  Icon: React.ElementType;
  onClick: () => void;
  isSelected?: boolean;
}

const RoundedIconButton: FC<RoundedIconButtonProps> = ({
  Icon,
  onClick,
  isSelected = false,
}) => {
  // Variants for the button container
  const buttonVariants = {
    unselected: {
      scale: 1,
      borderColor: "transparent",
      boxShadow: "0px 0px 0px rgba(59,130,246,0)",
      transition: { duration: 0.3 },
    },
    selected: {
      scale: 1.1,
      borderColor: "#3B82F6",
      boxShadow: "0px 0px 12px rgba(59,130,246,0.8)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Additional pulsating effect for the glow when selected
  const pulsateVariants = {
    animate: {
      scale: [1.1, 1.15, 1.1],
      boxShadow: [
        "0px 0px 12px rgba(59,130,246,0.8)",
        "0px 0px 20px rgba(59,130,246,1)",
        "0px 0px 12px rgba(59,130,246,0.8)"
      ],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className="rounded-full p-3 border-2 focus:outline-none"
      variants={buttonVariants}
      animate={isSelected ? "selected" : "unselected"}
      whileHover={{ scale: 1.05 }}
    >
      {isSelected ? (
        // Wrap the icon with another motion.div to add a pulsating animation
        <motion.div variants={pulsateVariants} animate="animate">
          <Icon size={24} />
        </motion.div>
      ) : (
        <Icon size={24} />
      )}
    </motion.button>
  );
};

export default RoundedIconButton;