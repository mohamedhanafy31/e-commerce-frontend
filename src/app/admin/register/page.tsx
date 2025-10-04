"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminRegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validate password in real-time
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Check if password meets all requirements
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      return;
    }
    
    try {
      await register(formData.name, formData.email, formData.password);
      // Redirect will happen automatically via useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by the auth store
      console.error("Registration failed:", err);
    }
  };

  const isFormValid = formData.name && 
                     formData.email && 
                     formData.password && 
                     formData.confirmPassword &&
                     formData.password === formData.confirmPassword &&
                     Object.values(passwordValidation).every(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <UserPlus className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            إنشاء حساب إداري
          </h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">
            Create a new admin account
          </p>
        </motion.div>

        {/* Registration Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                تسجيل حساب جديد
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Fill in your details to create an admin account
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pr-12 h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@example.com"
                      className="pr-12 h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="pr-12 pl-12 h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={passwordValidation.length ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={passwordValidation.number ? 'text-green-600' : 'text-gray-500'}>
                        One number
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pr-12 pl-12 h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-xs">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"
                        />
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      "إنشاء الحساب"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/admin" 
                    className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a 
              href="/contact" 
              className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
            >
              Contact support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
