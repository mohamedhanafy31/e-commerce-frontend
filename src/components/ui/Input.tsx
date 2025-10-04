import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, errorMessage, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative">
        <motion.input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right pr-10", // RTL: text-right, pr-10 for icon space
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.1 }}
          {...(props as any)}
        />
        
        {/* RTL: Status icons on the left (end) */}
        {(error || success) && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle className="h-4 w-4 text-green-500" />}
          </motion.div>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <motion.p
            className="text-sm text-destructive mt-1 text-right"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
