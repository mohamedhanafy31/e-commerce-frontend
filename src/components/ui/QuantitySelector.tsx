import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDecrease = () => {
    if (value > min && !disabled) {
      setIsAnimating(true);
      onChange(value - 1);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const handleIncrease = () => {
    if (value < max && !disabled) {
      setIsAnimating(true);
      onChange(value + 1);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  return (
    <div className={cn("flex items-center border rounded-md bg-background", className)}>
      {/* RTL: Minus button on the left (end) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={value <= min || disabled}
        className="rounded-l-none border-r"
      >
        <motion.div
          animate={{ scale: isAnimating ? 0.9 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <Minus className="h-4 w-4" />
        </motion.div>
      </Button>

      {/* Quantity display in center */}
      <motion.div
        className="px-4 py-2 min-w-[3rem] text-center font-medium text-right"
        animate={{ scale: isAnimating ? 1.05 : 1 }}
        transition={{ duration: 0.1 }}
      >
        {value}
      </motion.div>

      {/* RTL: Plus button on the right (start) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={value >= max || disabled}
        className="rounded-r-none border-l"
      >
        <motion.div
          animate={{ scale: isAnimating ? 0.9 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <Plus className="h-4 w-4" />
        </motion.div>
      </Button>
    </div>
  );
}
