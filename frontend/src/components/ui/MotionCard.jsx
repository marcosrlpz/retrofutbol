import { motion } from "framer-motion";

// Wrapper para animar cards en grids con efecto escalonado
export const MotionCard = ({ children, index = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.35,
      delay: index * 0.06,
      ease: [0.25, 0.1, 0.25, 1],
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Para elementos que aparecen al hacer scroll
export const FadeInWhenVisible = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default MotionCard;