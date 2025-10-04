import { Product } from "@/types";
import { HomeClient } from "./_components/HomeClient";

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

export default async function Home() {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3030/api/v1';
  let featuredProducts: Product[] = [] as any;
  try {
    const res = await fetch(`${BASE}/products?limit=6`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      featuredProducts = json?.data?.products ?? [];
    }
  } catch {}
  return <HomeClient featuredProducts={featuredProducts} />;
}
