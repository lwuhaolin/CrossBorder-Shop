# CrossBorder Shop - User Frontend

User-facing frontend application for the CrossBorder daily goods ordering system.

## Tech Stack

- **Framework**: Umi 4
- **UI Library**: Ant Design 5
- **Language**: TypeScript 5
- **State Management**: React Hooks
- **HTTP Client**: Axios

## Features

### Customer Features
- 🏠 **Home Page**: Hero carousel, category navigation, hot products, new arrivals
- 🛍️ **Product Catalog**: Product listing with filters, sorting, and search
- 📦 **Product Details**: Detailed product information with image gallery
- 🛒 **Shopping Cart**: Cart management with quantity adjustment
- 💳 **Checkout**: Multi-step checkout process with address and payment selection
- 👤 **User Profile**: User account management
- 📋 **Order Management**: Order history and tracking
- 📍 **Address Management**: Delivery address CRUD operations
- ❤️ **Favorites**: Wishlist functionality
- ⚙️ **Settings**: Profile and password management

### UI/UX Features
- Responsive design (mobile-first)
- Clean and modern interface
- Product cards with hover effects
- Category navigation
- Search functionality
- User authentication (login/register)
- Shopping cart with badge counter
- Order status tracking
- Mobile-friendly navigation

## Project Structure

```
user/
├── src/
│   ├── pages/              # Page components
│   │   ├── index.tsx       # Home page
│   │   ├── products/       # Product pages
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout
│   │   └── user/           # User pages
│   ├── components/         # Reusable components
│   │   ├── Header/         # Site header
│   │   ├── Footer/         # Site footer
│   │   ├── ProductCard/    # Product card
│   │   └── CategoryNav/    # Category navigation
│   ├── layouts/            # Layout components
│   ├── services/           # API services
│   ├── models/             # TypeScript models
│   ├── utils/              # Utility functions
│   └── global.css          # Global styles
├── public/                 # Static assets
├── .umirc.ts              # Umi configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Getting Started

### Prerequisites
- Node.js 16+
- pnpm (recommended) or npm

### Installation

```bash
cd user
pnpm install
```

### Development

```bash
pnpm dev
# App runs on http://localhost:8000
```

### Build

```bash
pnpm build
# Output in dist/ directory
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
NODE_ENV=development
```

## Routes

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/user/login` - Login
- `/user/register` - Registration
- `/user/profile` - User profile
- `/user/orders` - Order history
- `/user/orders/:id` - Order details
- `/user/addresses` - Address management
- `/user/favorites` - Favorites/Wishlist
- `/user/settings` - Account settings

## API Integration

The app integrates with the backend API using services in `src/services/`:

- **Product Service**: Product listing, details, search
- **Cart Service**: Cart management
- **Order Service**: Order creation and management
- **User Service**: Authentication and profile
- **Address Service**: Address CRUD operations
- **Category Service**: Product categories

## Styling

- Uses Ant Design component library
- CSS Modules for component-specific styles
- Global styles in `src/global.css`
- Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 992px
  - Desktop: > 992px

## Local Storage Usage

The app uses localStorage for:
- JWT token storage
- Shopping cart persistence
- User preferences
- Favorites/wishlist

## Future Enhancements

- [ ] Product reviews and ratings
- [ ] Advanced filters (price range, ratings)
- [ ] Product recommendations
- [ ] Order tracking with real-time updates
- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Social sharing
- [ ] Payment gateway integration
- [ ] Email notifications

## License

MIT
