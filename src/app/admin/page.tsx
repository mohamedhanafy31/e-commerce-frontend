"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  // Show session expired banner when redirected with reason
  const sessionExpired = searchParams.get("reason") === "session_expired";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(credentials.email, credentials.password);
      // Redirect will happen automatically via useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by the auth store
      console.error("Login failed:", err);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-warm-sand/30 via-ivory/50 to-warm-sand/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-green to-green-800 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-deep-maroon to-deep-maroon/80 bg-clip-text text-transparent">
            لوحة التحكم الإدارية
          </h1>
          <p className="mt-3 text-lg text-deep-maroon/70 font-medium">
            سجل الدخول للوصول إلى لوحة التحكم
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl border-warm-sand bg-ivory/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 border-b border-warm-sand/50">
              <CardTitle className="text-2xl font-bold text-deep-maroon">
                تسجيل الدخول
              </CardTitle>
              <p className="text-sm text-deep-maroon/70 mt-1">
                أدخل بيانات الاعتماد للمتابعة
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {sessionExpired && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-gold/20 border border-gold/50 text-gold px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.</span>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-deep-maroon/10 border border-deep-maroon/30 text-deep-maroon px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-deep-maroon mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
                    <Input
                      type="email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@ecommerce.local"
                      className="pr-12 h-12 text-base border-2 border-gold focus:border-emerald-green focus:ring-emerald-green transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-deep-maroon mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="AdminPass123"
                      className="pr-12 pl-12 h-12 text-base border-2 border-gold focus:border-emerald-green focus:ring-emerald-green transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold hover:text-emerald-green transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-green to-green-800 hover:from-green-800 hover:to-emerald-green shadow-lg text-white"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"
                        />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Registration Link */}
              <div className="text-center pt-4 border-t border-warm-sand/50">
                <p className="text-sm text-deep-maroon/70">
                  ليس لديك حساب؟{" "}
                  <Link 
                    href="/admin/register" 
                    className="text-emerald-green hover:text-green-800 font-semibold hover:underline transition-colors"
                  >
                    إنشاء حساب هنا
                  </Link>
                </p>
              </div>

              {/* Removed demo credentials block */}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-sm text-deep-maroon/70">
            تحتاج مساعدة؟{" "}
            <a 
              href="/contact" 
              className="text-emerald-green hover:text-green-800 font-semibold hover:underline transition-colors"
            >
              تواصل مع الدعم
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-warm-sand/30 via-ivory/50 to-warm-sand/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green mx-auto"></div>
          <p className="mt-4 text-deep-maroon/70">جاري التحميل...</p>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
