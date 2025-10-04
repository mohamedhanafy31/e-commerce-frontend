import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-warm-sand bg-gradient-to-br from-warm-sand to-warm-sand/70 relative overflow-hidden">
      {/* Subtle Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300695C' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-green to-green-800 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">ت</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-deep-maroon">متجر السوبر ماركت</span>
                <span className="text-xs text-gold font-medium">TOLIDO</span>
              </div>
            </div>
            <p className="text-sm text-deep-maroon/70 leading-relaxed">
              متجرك الموثوق للتسوق الإلكتروني - منتجات طازجة وعروض مميزة
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-deep-maroon/70 hover:text-gold transition-colors transform hover:scale-110">
                <span className="sr-only">فيسبوك</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-deep-maroon/70 hover:text-gold transition-colors transform hover:scale-110">
                <span className="sr-only">تويتر</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-deep-maroon/70 hover:text-gold transition-colors transform hover:scale-110">
                <span className="sr-only">إنستغرام</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
                  <path d="M12.017 0C52.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-green">روابط سريعة</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/products"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                جميع المنتجات
              </Link>
              <Link
                href="/categories"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                الفئات
              </Link>
              <Link
                href="/search"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                البحث
              </Link>
              <Link
                href="/offers"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                العروض الخاصة
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-green">خدمة العملاء</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/orders/track"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                تتبع الطلب
              </Link>
              <Link
                href="/help"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                مركز المساعدة
              </Link>
              <Link
                href="/contact"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                اتصل بنا
              </Link>
              <Link
                href="/faq"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                الأسئلة الشائعة
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-green">معلومات قانونية</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/privacy"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                شروط الاستخدام
              </Link>
              <Link
                href="/returns"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                سياسة الإرجاع
              </Link>
              <Link
                href="/shipping"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                معلومات الشحن
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-deep-maroon/80">
              © 2024 متجر السوبر ماركت TOLIDO. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/admin"
                className="text-sm text-deep-maroon/80 hover:text-emerald-green transition-colors"
              >
                لوحة الإدارة
              </Link>
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-deep-maroon/80">
                <span>مدعوم بـ</span>
                <span className="text-gold font-bold">TOLIDO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
