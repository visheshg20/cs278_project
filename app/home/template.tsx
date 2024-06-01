"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
