import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = [
  "hsl(38 92% 50%)",
  "hsl(45 100% 60%)",
  "hsl(16 85% 55%)",
  "hsl(142 70% 45%)",
  "hsl(280 80% 60%)",
  "hsl(200 80% 55%)",
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

export function ConfettiEffect({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        size: 4 + Math.random() * 8,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 720 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeIn" }}
          className="fixed top-0 z-50 pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </AnimatePresence>
  );
}
