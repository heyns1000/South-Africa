# South Africa E-commerce Platform

A modern, full-stack e-commerce platform built for the South African market with integrated payment processing through PayPal and PayFast.

## Features

### 🔐 Authentication System
- Secure user registration and login
- Session-based authentication with Passport.js
- Password hashing (production-ready with bcrypt)
- Protected routes and user profile management

### 🛍️ E-commerce Functionality
- Product browsing with search and filtering
- Shopping cart with localStorage persistence
- Real-time stock management
- Order tracking and history
- Responsive product cards with images

### 💳 Payment Integration
- **PayPal**: International payment processing
- **PayFast**: South African payment gateway integration
- Secure payment handling with webhook support
- Order status tracking

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark mode support with next-themes
- Toast notifications for user feedback
- Accessible components using Radix UI
- Mobile-friendly navigation

### 🔒 Security
- Session management with PostgreSQL storage
- Environment variable configuration
- CORS protection
- Input validation with Zod
- SQL injection prevention with Drizzle ORM

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Passport.js** - Authentication
- **Drizzle ORM** - Database ORM
- **Neon Serverless** - PostgreSQL database
- **Express Session** - Session management
- **WebSocket** (ws) - Real-time communication

### Payment Processing
- **PayPal Server SDK** - PayPal integration
- **PayFast API** - South African payment gateway

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- PayPal account (for PayPal payments)
- PayFast account (for South African payments)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd South-Africa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your credentials:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_random_secret_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_MODE=sandbox
   PAYFAST_MERCHANT_ID=your_merchant_id
   PAYFAST_MERCHANT_KEY=your_merchant_key
   PAYFAST_PASSPHRASE=your_passphrase
   PAYFAST_MODE=sandbox
   NODE_ENV=development
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

   This creates all necessary tables using Drizzle ORM migrations.

## Development

Start the development server:

```bash
npm run dev
```

This will:
- Start the Express backend on `http://localhost:5000`
- Start the Vite dev server on `http://localhost:5173`
- Enable hot module replacement for React

The application will be available at `http://localhost:5173`

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

   This creates:
   - Frontend build in `dist/public/`
   - Backend build in `dist/`

2. **Start the production server**
   ```bash
   npm start
   ```

   The server will serve both the API and static frontend files on port 5000.

## Project Structure

```
South-Africa/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── CheckoutPage.tsx
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUser.ts
│   │   │   ├── useCart.ts
│   │   │   └── useToast.ts
│   │   ├── lib/          # Utilities and clients
│   │   │   ├── api.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Global styles
│   └── index.html        # HTML entry point
├── server/                # Backend Express application
│   ├── routes/           # API routes
│   │   ├── auth.ts       # Authentication routes
│   │   ├── users.ts      # User management
│   │   ├── products.ts   # Product routes
│   │   ├── orders.ts     # Order management
│   │   └── payments.ts   # Payment processing
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Auth middleware
│   │   └── errorHandler.ts
│   ├── lib/              # Server utilities
│   │   ├── paypal.ts     # PayPal integration
│   │   └── payfast.ts    # PayFast integration
│   └── index.ts          # Server entry point
├── db/                   # Database schema and connection
│   ├── schema.ts         # Drizzle ORM schema
│   └── index.ts          # Database connection
├── shared/               # Shared types and schemas
│   ├── types.ts          # TypeScript types
│   └── schemas.ts        # Zod validation schemas
└── attached_assets/      # Static assets

Configuration Files:
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── drizzle.config.ts     # Drizzle ORM configuration
├── components.json       # Shadcn/ui configuration
└── postcss.config.js     # PostCSS configuration
```

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Products Table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price (decimal)
- `image` - Product image URL
- `category` - Product category
- `stock` - Available stock quantity
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Orders Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `total` - Order total amount
- `status` - Order status (pending, paid, shipped, etc.)
- `payment_method` - Payment method used
- `payment_id` - Payment transaction ID
- `shipping_address` - Delivery address
- `created_at` - Order creation timestamp
- `updated_at` - Last update timestamp

### Order Items Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `product_id` - Foreign key to products
- `quantity` - Quantity ordered
- `price` - Price at time of order

### Sessions Table
- Managed by `connect-pg-simple` for session storage

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (supports ?category=, ?search=)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Orders
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)
- `POST /api/orders` - Create new order (auth required)
- `PATCH /api/orders/:id/status` - Update order status (auth required)

### Payments
- `POST /api/payments/paypal/create` - Create PayPal order
- `POST /api/payments/paypal/capture` - Capture PayPal payment
- `POST /api/payments/payfast/create` - Create PayFast payment
- `POST /api/payments/payfast/notify` - PayFast ITN handler
- `GET /api/payments/payfast/return` - PayFast return URL
- `GET /api/payments/payfast/cancel` - PayFast cancel URL

## Payment Gateway Setup

### PayPal Setup
1. Create a PayPal Developer account at https://developer.paypal.com
2. Create a REST API app in the Dashboard
3. Copy your Client ID and Secret to `.env`
4. Use `sandbox` mode for testing, `live` for production

### PayFast Setup
1. Create a PayFast account at https://www.payfast.co.za
2. Get your Merchant ID and Merchant Key from the dashboard
3. Set a passphrase in your PayFast settings
4. Copy credentials to `.env`
5. Use `sandbox` mode for testing, `live` for production

## Deployment

### Deploying to Replit

1. **Fork or import the repository to Replit**

2. **Add Secrets in Replit**
   - Go to Tools → Secrets
   - Add all environment variables from `.env.example`

3. **Provision a PostgreSQL database**
   - Replit will automatically provision a Neon PostgreSQL database
   - The `DATABASE_URL` secret will be set automatically

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

### Deploying Elsewhere

The application can be deployed to any Node.js hosting platform:
- Heroku
- Vercel (with Node.js runtime)
- Railway
- DigitalOcean App Platform
- AWS, Google Cloud, Azure

Ensure you:
1. Set all environment variables
2. Have a PostgreSQL database
3. Run `npm run db:push` after deployment
4. Use `npm run build && npm start` to run in production

## Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Register a new account
   - [ ] Login with credentials
   - [ ] Access protected pages
   - [ ] Logout

2. **Products**
   - [ ] View product list
   - [ ] Search products
   - [ ] Filter by category
   - [ ] View product details

3. **Shopping Cart**
   - [ ] Add products to cart
   - [ ] Update quantities
   - [ ] Remove items
   - [ ] Cart persists on page reload

4. **Checkout**
   - [ ] Complete checkout form
   - [ ] Process PayPal payment
   - [ ] Process PayFast payment
   - [ ] View order confirmation

5. **Dashboard**
   - [ ] View user profile
   - [ ] View order history
   - [ ] Check order status

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure database is accessible
- Run `npm run db:push` to create tables

### Payment Issues
- Verify API credentials are correct
- Check if in sandbox/test mode
- Review payment gateway logs
- Ensure webhook URLs are accessible

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear TypeScript build info: `rm node_modules/typescript/tsbuildinfo`
- Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API logs for errors

## Acknowledgments

- Built with modern web technologies
- Designed for the South African market
- Integrated with local payment solutions
- Following best practices for security and performance
