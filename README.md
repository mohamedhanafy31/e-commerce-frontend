# EcomStore Frontend

A modern e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Browsing**: Browse and search products with filtering
- 🛒 **Shopping Cart**: Add items to cart with persistent storage
- 💳 **Checkout**: Multi-step checkout process
- 📦 **Order Tracking**: Track orders by order number
- ⭐ **Reviews**: Product review and rating system
- 👨‍💼 **Admin Dashboard**: Product and order management
- 📱 **Responsive**: Mobile-first responsive design
- ♿ **Accessible**: WCAG compliant components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom wrapper

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── product/           # Product components
│   ├── cart/              # Cart components
│   └── checkout/          # Checkout components
├── lib/                   # Utilities and configurations
├── services/              # API service functions
├── stores/                # Zustand state stores
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── constants/             # Application constants
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API through service functions located in `src/services/`. The API client handles authentication, error handling, and request/response formatting.

### Key Services

- **Product Service**: Product CRUD, search, and filtering
- **Order Service**: Order creation and tracking
- **Review Service**: Product reviews and ratings

## State Management

The application uses Zustand for client-side state management:

- **Cart Store**: Shopping cart state with localStorage persistence
- **Auth Store**: User authentication state (to be implemented)

## Styling

The project uses Tailwind CSS for styling with a custom design system:

- **Colors**: Primary, secondary, and semantic color palette
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components with variants

## Development Guidelines

### Code Style

- Use TypeScript for all components and functions
- Follow React best practices and hooks patterns
- Use Tailwind CSS classes for styling
- Implement proper error handling and loading states

### Component Structure

```tsx
// Component template
interface ComponentProps {
  // Props interface
}

export function Component({ prop }: ComponentProps) {
  // Component logic
  
  return (
    // JSX with proper accessibility attributes
  );
}
```

### API Integration

```tsx
// Service usage example
import { productService } from '@/services/productService';

const { data, error, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.getProducts()
});
```

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

### Build for Production

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# e-commerce-frontend
