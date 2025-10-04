"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Eye, EyeOff } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useCustomerAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    router.push("/");
  };

  // Ensure CSRF cookie is present before first POST
  useEffect(() => {
    apiClient.get<{ message?: string }>("/").catch(() => undefined);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-start md:items-center justify-center px-4 py-10 bg-gradient-to-br from-warm-sand/20 to-ivory/30">
      <div className="w-full max-w-md">
        <Card className="border-warm-sand bg-ivory shadow-xl">
          <CardHeader className="text-center border-b border-warm-sand/50">
            <CardTitle className="text-2xl text-deep-maroon font-bold">تسجيل الدخول</CardTitle>
            <p className="text-deep-maroon/70 mt-2">مرحباً بك في متجر السوبر ماركت</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-deep-maroon">البريد الإلكتروني</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-deep-maroon">كلمة المرور</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="border-gold focus:border-emerald-green focus:ring-emerald-green pr-12"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 left-2 flex items-center text-gold hover:text-emerald-green transition-colors"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-deep-maroon bg-warm-sand/30 p-2 rounded-md">{error}</p>}
              <Button 
                type="submit" 
                className="w-full bg-emerald-green hover:bg-green-800 text-white font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-deep-maroon/70">
              ليس لديك حساب؟ {" "}
              <Link href="/account/register" className="text-emerald-green hover:text-green-800 hover:underline font-medium">إنشاء حساب جديد</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


