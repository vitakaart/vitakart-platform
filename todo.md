# ✅ VITAKART PLATFORM — MASTER TODO LIST
**"Build Once — Use Forever — Scale Anywhere"**
Stack: Next.js 16 + ASP.NET Core 10 + PostgreSQL


# 📌 PHASE 0 — FOUNDATION SETUP (Reusability Core)

## Core Architecture Decision
- [x] Decide Multi-tenant architecture from day 1
- [ ] Design tenant isolation strategy (shared DB with tenant_id)
- [ ] Design theme/branding system per tenant
- [ ] Design feature flag system (enable/disable features per tenant)
- [ ] Design plugin/module system (add/remove features easily)
- [ ] Design configuration system per tenant
- [ ] Design domain mapping system per tenant
- [ ] Design white label system

## Monorepo Setup
- [x] Setup monorepo with Turborepo
- [x] Create packages folder for shared code
- [x] Create apps folder for different apps
- [ ] Setup shared TypeScript types package
- [x] Setup shared UI components package
- [ ] Setup shared utilities package
- [ ] Setup shared constants package
- [ ] Setup shared validation schemas package


# 📌 PHASE 1 — PLANNING & BUSINESS SETUP

## Brand Planning
- [ ] Decide brand name (placeholder: vitakart)
- [ ] Decide logo concept
- [ ] Decide color system (primary, secondary, accent)
- [ ] Decide typography (fonts)
- [ ] Decide design language (modern, minimal, bold)
- [x] Decide product categories (Health & Wellness)
- [ ] Decide pricing strategy
- [ ] Decide delivery zones
- [ ] Decide payment methods
- [ ] Decide return and refund policy
- [ ] Decide shipping partners
- [x] Decide vendor policy (single vendor first)
- [ ] Decide subscription model rules

## Legal & Business
- [ ] Register business
- [ ] Get GST registration
- [ ] Open business bank account
- [ ] Setup Razorpay account
- [ ] Setup Shiprocket account
- [ ] Create Terms and Conditions
- [ ] Create Privacy Policy
- [ ] Create Return Policy
- [ ] Create Shipping Policy

## Market Research
- [ ] Analyze top 5 competitors
- [ ] Identify unique selling points
- [x] Define target audience persona (18-40, health conscious)
- [ ] Define product catalog structure
- [ ] Define SEO keyword strategy


# 📌 PHASE 2 — SYSTEM & DATABASE DESIGN

## System Design
- [x] Draw complete architecture diagram
- [x] Define all modules list
- [ ] Define module boundaries
- [ ] Define API contracts
- [x] Define database schema
- [ ] Define caching strategy
- [ ] Define file storage strategy
- [ ] Define email service strategy
- [ ] Define SMS service strategy
- [ ] Define search strategy
- [ ] Define logging strategy
- [ ] Define error handling strategy
- [ ] Define security strategy
- [ ] Define CI/CD strategy
- [ ] Define environment strategy
- [ ] Define backup strategy
- [ ] Define monitoring strategy
- [ ] Define feature flag strategy
- [ ] Define tenant config strategy

## Database Design
- [ ] Design tenants table
- [ ] Design tenant configs table
- [ ] Design tenant themes table
- [ ] Design feature flags table
- [ ] Design users table
- [ ] Design addresses table
- [ ] Design categories table
- [ ] Design sub categories table
- [ ] Design products table
- [ ] Design product variants table
- [ ] Design product images table
- [ ] Design product tags table
- [ ] Design inventory table
- [ ] Design inventory logs table
- [ ] Design carts table
- [ ] Design cart items table
- [ ] Design wishlists table
- [ ] Design coupons table
- [ ] Design coupon usages table
- [ ] Design orders table
- [ ] Design order items table
- [ ] Design order status history table
- [ ] Design payments table
- [ ] Design shipments table
- [ ] Design reviews table
- [ ] Design review images table
- [ ] Design notifications table
- [ ] Design subscriptions table
- [ ] Design subscription plans table
- [ ] Design pages table (CMS)
- [ ] Design banners table
- [ ] Design blogs table
- [ ] Design faqs table
- [ ] Design settings table


# 📌 PHASE 3 — PROJECT SETUP

## Monorepo & Repository
- [x] Create GitHub organization
- [x] Create monorepo with Turborepo
- [x] Setup all apps and packages folders
- [ ] Setup branch strategy
- [x] Setup gitignore
- [x] Setup README files
- [ ] Setup environment files structure

## Backend Setup (ASP.NET Core 9)
- [x] Create ASP.NET Core Web API project
- [ ] Setup Clean Architecture folder structure
- [ ] Install all required NuGet packages
- [ ] Setup Entity Framework Core 9
- [ ] Setup PostgreSQL connection
- [ ] Setup database migrations
- [ ] Setup multi-tenant middleware
- [ ] Setup JWT authentication
- [ ] Setup refresh token system
- [ ] Setup role based authorization
- [ ] Setup CORS policy
- [ ] Setup Serilog logging
- [ ] Setup global exception handler
- [ ] Setup API versioning
- [ ] Setup Swagger documentation
- [ ] Setup FluentValidation
- [ ] Setup AutoMapper
- [ ] Setup MediatR (CQRS pattern)
- [ ] Setup Redis connection
- [ ] Setup health check endpoints
- [ ] Setup rate limiting middleware
- [ ] Setup request logging middleware
- [ ] Setup Docker file

## Frontend Web Setup (Next.js 15)
- [x] Create Next.js 15 project with TypeScript
- [x] Setup Tailwind CSS 4
- [ ] Setup Shadcn UI
- [ ] Setup theme system (CSS variables per tenant)
- [ ] Setup folder structure
- [ ] Setup environment variables
- [ ] Setup Axios instance with interceptors
- [ ] Setup React Query v5
- [ ] Setup Zustand v5
- [ ] Setup React Hook Form v7
- [ ] Setup Zod validation
- [ ] Setup NextAuth.js
- [ ] Setup PWA configuration
- [ ] Setup next-seo
- [ ] Setup Google Analytics
- [ ] Setup error boundary
- [ ] Setup Docker file

## Admin Panel Setup (Next.js 15)
- [x] Create separate Next.js admin app
- [x] Setup same tech stack
- [ ] Setup admin specific components
- [ ] Setup chart library (Recharts / Chart.js)
- [ ] Setup data table library (TanStack Table)
- [ ] Setup admin auth flow
- [ ] Setup role based UI rendering

## Database & Infrastructure Setup
- [⏭️] Setup PostgreSQL locally (Docker) — Skipped, using Neon cloud
- [⏭️] Setup Redis locally (Docker) — Skipped, using Upstash cloud
- [⏭️] Setup MeiliSearch locally (Docker) — Skipped, using cloud
- [ ] Create docker-compose for local development
- [ ] Setup database migrations structure
- [ ] Setup seed data scripts
- [ ] Create initial admin user seed
- [ ] Create initial tenant seed

## Cloud Accounts Setup
- [ ] Setup Vercel account
- [ ] Setup Azure / Render account
- [ ] Setup Neon / Supabase account
- [ ] Setup Cloudinary account
- [ ] Setup Upstash Redis account
- [ ] Setup SendGrid account
- [ ] Setup MSG91 account
- [ ] Setup Sentry account
- [ ] Setup UptimeRobot account
- [ ] Setup domain and DNS


# 📌 PHASE 4 — BACKEND DEVELOPMENT

## Multi-Tenant Module
- [ ] Tenant registration
- [ ] Tenant update
- [ ] Tenant delete (soft)
- [ ] Get tenant by domain
- [ ] Get tenant by id
- [ ] Tenant config management
- [ ] Tenant theme management
- [ ] Tenant feature flags management
- [ ] Tenant domain mapping
- [ ] Tenant status management (active/inactive/suspended)
- [ ] Tenant middleware (resolve tenant from request)

## Feature Flag Module
- [ ] Create feature flag
- [ ] Update feature flag
- [ ] Delete feature flag
- [ ] Get all feature flags by tenant
- [ ] Check if feature enabled for tenant
- [ ] Enable feature for tenant
- [ ] Disable feature for tenant
- [ ] Global feature flags
- [ ] Tenant specific feature flags

## Config Module
- [ ] Get config by key
- [ ] Set config by key
- [ ] Delete config by key
- [ ] Get all configs by tenant
- [ ] Config categories (general, payment, shipping, email, sms)

## CMS Module
- [ ] Create page
- [ ] Update page
- [ ] Delete page
- [ ] Get page by slug
- [ ] Get all pages
- [ ] Create banner
- [ ] Update banner
- [ ] Delete banner
- [ ] Get active banners by position
- [ ] Create blog post
- [ ] Update blog post
- [ ] Delete blog post
- [ ] Get blog by slug
- [ ] Get all blogs (paginated)
- [ ] Create FAQ
- [ ] Update FAQ
- [ ] Delete FAQ
- [ ] Get all FAQs by category

## Media Module
- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Delete image
- [ ] Get image by id
- [ ] Image optimization
- [ ] Image resize variants (thumbnail, medium, large)
- [ ] Cloudinary integration

## Auth Module
- [ ] User registration
- [ ] Email verification
- [ ] Resend verification email
- [ ] User login (JWT)
- [ ] Refresh token
- [ ] Logout
- [ ] Forgot password
- [ ] Reset password
- [ ] Change password
- [ ] Get current user
- [ ] Update profile
- [ ] Upload profile picture
- [ ] Google OAuth login
- [ ] Admin login
- [ ] Super admin login
- [ ] Role management

## User Module
- [ ] Get all users (admin)
- [ ] Get user by id (admin)
- [ ] Update user (admin)
- [ ] Deactivate user (admin)
- [ ] Delete user (admin, soft delete)
- [ ] Get user addresses
- [ ] Add address
- [ ] Update address
- [ ] Delete address
- [ ] Set default address
- [ ] Get user order history
- [ ] Get user wishlist
- [ ] Get user reviews
- [ ] Get user notifications

## Category Module
- [ ] Create category
- [ ] Update category
- [ ] Delete category (soft delete)
- [ ] Get all categories (paginated)
- [ ] Get category by slug
- [ ] Get active categories
- [ ] Upload category image
- [ ] Reorder categories
- [ ] Create sub category
- [ ] Update sub category
- [ ] Delete sub category (soft delete)
- [ ] Get sub categories by category
- [ ] Category SEO meta management

## Product Module
- [ ] Create product
- [ ] Update product
- [ ] Delete product (soft delete)
- [ ] Get all products (paginated, filtered, sorted)
- [ ] Get product by slug
- [ ] Get products by category
- [ ] Get products by sub category
- [ ] Get featured products
- [ ] Get new arrivals
- [ ] Get best sellers
- [ ] Get related products
- [ ] Get products by tags
- [ ] Search products (MeiliSearch)
- [ ] Bulk import products (CSV)
- [ ] Bulk export products (CSV)
- [ ] Bulk update status
- [ ] Bulk delete
- [ ] Duplicate product
- [ ] Product SEO meta management
- [ ] Product scheduling (publish at future date)

## Product Variant Module
- [ ] Add variant to product
- [ ] Update variant
- [ ] Delete variant (soft delete)
- [ ] Get variants by product
- [ ] Update variant stock
- [ ] Variant price management
- [ ] Variant SKU management

## Product Image Module
- [ ] Upload product images
- [ ] Delete product image
- [ ] Set primary image
- [ ] Reorder images

## Inventory Module
- [ ] Get inventory by product variant
- [ ] Stock in (restock)
- [ ] Stock out (on order)
- [ ] Stock adjustment
- [ ] Get inventory log
- [ ] Get low stock products
- [ ] Get out of stock products
- [ ] Low stock alert trigger
- [ ] Inventory report

## Cart Module
- [ ] Get cart (user or guest)
- [ ] Add item to cart
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear cart
- [ ] Apply coupon
- [ ] Remove coupon
- [ ] Calculate totals (subtotal, tax, shipping, discount, total)
- [ ] Merge guest cart on login
- [ ] Save cart (persistent)
- [ ] Validate cart items (stock check before checkout)

## Wishlist Module
- [ ] Get wishlist
- [ ] Add to wishlist
- [ ] Remove from wishlist
- [ ] Check if in wishlist
- [ ] Move to cart
- [ ] Clear wishlist
- [ ] Share wishlist

## Coupon Module
- [ ] Create coupon
- [ ] Update coupon
- [ ] Delete coupon (soft delete)
- [ ] Get all coupons (admin, paginated)
- [ ] Get active coupons
- [ ] Validate coupon
- [ ] Apply coupon
- [ ] Track coupon usage
- [ ] Coupon type - Flat discount
- [ ] Coupon type - Percentage discount
- [ ] Coupon type - Free shipping
- [ ] Coupon type - Buy X get Y
- [ ] Coupon type - First order only
- [ ] Coupon type - User specific
- [ ] Coupon type - Category specific
- [ ] Coupon type - Product specific
- [ ] Coupon - Minimum order value
- [ ] Coupon - Maximum discount cap
- [ ] Coupon - Usage limit per user
- [ ] Coupon - Total usage limit
- [ ] Coupon - Expiry date management

## Order Module
- [ ] Create order
- [ ] Get order by id
- [ ] Get order by order number
- [ ] Get my orders (customer, paginated)
- [ ] Get all orders (admin, paginated, filtered)
- [ ] Update order status (admin)
- [ ] Cancel order (customer, within time limit)
- [ ] Cancel order (admin)
- [ ] Return order request
- [ ] Return order approve (admin)
- [ ] Return order reject (admin)
- [ ] Order status history log
- [ ] Order invoice generate (PDF)
- [ ] Order confirmation trigger (email + sms)
- [ ] Order status update trigger (email + sms)
- [ ] Bulk update order status (admin)
- [ ] Order notes (admin internal)
- [ ] Order export (CSV/Excel)

## Payment Module
- [ ] Create Razorpay order
- [ ] Verify Razorpay payment
- [ ] Save payment record
- [ ] Get payment by order
- [ ] Payment failed handling
- [ ] Retry payment
- [ ] COD order handling
- [ ] Refund initiation
- [ ] Refund status check
- [ ] Refund webhook handling
- [ ] Payment webhook handling
- [ ] Payment receipt generation
- [ ] UPI payment support
- [ ] Card payment support
- [ ] Net banking support
- [ ] Wallet payment support

## Shipping Module
- [ ] Calculate shipping charges
- [ ] Free shipping threshold check
- [ ] Create shipment (Shiprocket)
- [ ] Generate AWB number
- [ ] Track shipment
- [ ] Delivery status update webhook
- [ ] Estimated delivery date
- [ ] Multiple courier support
- [ ] Delivery zone management
- [ ] Pincode serviceability check

## Review Module
- [ ] Add review (verified purchase only option)
- [ ] Update review
- [ ] Delete review (customer)
- [ ] Delete review (admin)
- [ ] Get reviews by product (paginated)
- [ ] Get reviews by user
- [ ] Admin approve review
- [ ] Admin reject review
- [ ] Average rating calculation
- [ ] Rating breakdown (1-5 stars count)
- [ ] Review with images
- [ ] Review helpful votes
- [ ] Review report (spam)

## Notification Module
- [ ] Create notification
- [ ] Get notifications by user (paginated)
- [ ] Mark notification as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Get unread count
- [ ] In-app notification system
- [ ] Email - Welcome email
- [ ] Email - Email verification
- [ ] Email - Password reset
- [ ] Email - Order placed
- [ ] Email - Order confirmed
- [ ] Email - Order shipped
- [ ] Email - Order delivered
- [ ] Email - Order cancelled
- [ ] Email - Refund initiated
- [ ] Email - Refund processed
- [ ] Email - Review approved
- [ ] Email - Subscription reminder
- [ ] Email - Newsletter
- [ ] SMS - OTP verification
- [ ] SMS - Order placed
- [ ] SMS - Order shipped
- [ ] SMS - Order delivered
- [ ] SMS - Order cancelled
- [ ] Push notification setup (future mobile app)

## Search Module
- [ ] Full text product search
- [ ] Search with filters
- [ ] Filter by category
- [ ] Filter by sub category
- [ ] Filter by price range
- [ ] Filter by rating
- [ ] Filter by brand
- [ ] Filter by tags
- [ ] Sort by price asc/desc
- [ ] Sort by newest
- [ ] Sort by popularity
- [ ] Sort by rating
- [ ] Search suggestions autocomplete
- [ ] Popular searches tracking
- [ ] Search history per user
- [ ] No results handling
- [ ] MeiliSearch indexing
- [ ] Re-index products trigger

## Report & Analytics Module
- [ ] Sales report (daily, weekly, monthly, yearly)
- [ ] Revenue report
- [ ] Orders report
- [ ] Products report
- [ ] Category wise report
- [ ] Customer report
- [ ] Inventory report
- [ ] Coupon usage report
- [ ] Return and refund report
- [ ] Traffic report integration (GA4)
- [ ] Top selling products
- [ ] Top customers
- [ ] Conversion rate tracking
- [ ] Export reports (CSV/Excel/PDF)
- [ ] Dashboard summary stats
- [ ] Revenue chart data
- [ ] Orders chart data

## Subscription Module
- [ ] Create subscription plan
- [ ] Update subscription plan
- [ ] Delete subscription plan
- [ ] Get all plans
- [ ] Subscribe to plan
- [ ] Cancel subscription
- [ ] Pause subscription
- [ ] Resume subscription
- [ ] Subscription renewal auto
- [ ] Subscription payment auto charge
- [ ] Subscription history
- [ ] Subscription reminder (email + sms)
- [ ] Trial period support
- [ ] Subscription invoice

## Affiliate & Referral Module
- [ ] Generate referral code per user
- [ ] Track referral usage
- [ ] Referral reward type (discount/cashback/points)
- [ ] Referral history
- [ ] Referral report (admin)
- [ ] Influencer affiliate program
- [ ] Affiliate link tracking
- [ ] Commission calculation
- [ ] Affiliate payout management

## Loyalty Points Module
- [ ] Earn points on purchase
- [ ] Redeem points on checkout
- [ ] Points expiry management
- [ ] Points history
- [ ] Points balance
- [ ] Points config (how many points per rupee)

## Multi-Tenant Admin Module
- [ ] Create tenant
- [ ] Update tenant
- [ ] Suspend tenant
- [ ] Delete tenant
- [ ] View all tenants
- [ ] Tenant stats
- [ ] Tenant billing management
- [ ] Tenant feature management
- [ ] Tenant config management
- [ ] Tenant theme management

## Super Admin Module
- [ ] Manage all tenants
- [ ] Global settings
- [ ] Global feature flags
- [ ] Global announcement
- [ ] Platform revenue report
- [ ] Platform stats


# 📌 PHASE 5 — FRONTEND DEVELOPMENT

## Shared UI Package (packages/ui)
- [ ] Button component
- [ ] Input component
- [ ] Select component
- [ ] Checkbox component
- [ ] Radio component
- [ ] Switch component
- [ ] Textarea component
- [ ] Modal component
- [ ] Drawer component
- [ ] Dropdown component
- [ ] Tooltip component
- [ ] Badge component
- [ ] Avatar component
- [ ] Card component
- [ ] Tabs component
- [ ] Accordion component
- [ ] Alert component
- [ ] Toast component
- [ ] Skeleton component
- [ ] Spinner component
- [ ] Progress bar component
- [ ] Star rating component
- [ ] Image component (optimized)
- [ ] Table component
- [ ] Pagination component
- [ ] Breadcrumb component
- [ ] Empty state component
- [ ] Error state component
- [ ] Stepper component
- [ ] File upload component
- [ ] Date picker component
- [ ] Price display component
- [ ] Quantity selector component
- [ ] Search bar component
- [ ] Color picker component

## Theme System
- [ ] Setup CSS variables system
- [ ] Light mode support
- [ ] Dark mode support
- [ ] Per tenant theme config
- [ ] Font system (per tenant)
- [ ] Color system (per tenant)
- [ ] Border radius system
- [ ] Spacing system
- [ ] Load theme from API on app start

## Web - Layout Components
- [ ] Navbar (desktop)
- [ ] Navbar (mobile)
- [ ] Mobile bottom navigation
- [ ] Footer
- [ ] Mega menu
- [ ] Category sidebar
- [ ] Cart sidebar (quick view)
- [ ] Search overlay
- [ ] Filter sidebar
- [ ] Announcement bar
- [ ] Cookie consent banner

## Web - Auth Pages
- [ ] Login page
- [ ] Register page
- [ ] Email verification page
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Google OAuth callback page

## Web - Home Page Sections
- [ ] Hero banner slider
- [ ] Featured categories section
- [ ] Featured products section
- [ ] New arrivals section
- [ ] Best sellers section
- [ ] Promotional banner section
- [ ] Subscription plans section
- [ ] Testimonials section
- [ ] Brand logos section
- [ ] Blog preview section
- [ ] Newsletter signup section
- [ ] Trust badges section

## Web - Product Pages
- [ ] Product listing page
- [ ] Product listing with infinite scroll
- [ ] Product card component
- [ ] Product detail page
- [ ] Product image gallery with zoom
- [ ] Product variant selector
- [ ] Product quantity selector
- [ ] Add to cart button with animation
- [ ] Add to wishlist button
- [ ] Stock indicator
- [ ] Product description tabs
- [ ] Nutritional info section
- [ ] Related products carousel
- [ ] Recently viewed products
- [ ] Reviews section
- [ ] Write review form
- [ ] Rating breakdown chart
- [ ] Breadcrumb navigation
- [ ] Share product buttons
- [ ] Product SEO meta

## Web - Category Pages
- [ ] Category listing page
- [ ] Sub category listing page
- [ ] Category banner
- [ ] Category products with filters

## Web - Search Page
- [ ] Search results page
- [ ] Search bar with autocomplete
- [ ] Active filters display
- [ ] Filter panel (category, price, rating, brand)
- [ ] Sort dropdown
- [ ] Results count
- [ ] No results state
- [ ] Search suggestions

## Web - Cart Page
- [ ] Cart items list
- [ ] Cart item image and details
- [ ] Quantity updater
- [ ] Remove item
- [ ] Save for later
- [ ] Apply coupon input
- [ ] Coupon applied display
- [ ] Order summary card
- [ ] Delivery estimate
- [ ] Proceed to checkout button
- [ ] Empty cart state
- [ ] Related products suggestion

## Web - Checkout Pages
- [ ] Checkout stepper (Address, Payment, Review)
- [ ] Address selection step
- [ ] Add new address form
- [ ] Payment method selection step
- [ ] Razorpay payment integration
- [ ] COD option
- [ ] Order review step
- [ ] Place order button
- [ ] Order confirmation page
- [ ] Order number display
- [ ] Continue shopping button

## Web - Account Pages
- [ ] Account dashboard
- [ ] My orders list page
- [ ] Order detail page
- [ ] Order tracking page
- [ ] Order invoice download
- [ ] Cancel order flow
- [ ] Return order flow
- [ ] My wishlist page
- [ ] My addresses page
- [ ] Add address page
- [ ] Edit address page
- [ ] My profile page
- [ ] Edit profile page
- [ ] Change password page
- [ ] My reviews page
- [ ] Write review page
- [ ] My notifications page
- [ ] My subscription page
- [ ] My loyalty points page
- [ ] My referrals page
- [ ] Delete account option

## Web - Static Pages
- [ ] About us page
- [ ] Contact us page
- [ ] FAQ page
- [ ] Blog list page
- [ ] Blog detail page
- [ ] Terms and conditions page
- [ ] Privacy policy page
- [ ] Return policy page
- [ ] Shipping policy page
- [ ] 404 page
- [ ] 500 page
- [ ] Maintenance page
- [ ] Coming soon page

## Admin - Layout
- [ ] Admin sidebar navigation
- [ ] Admin header
- [ ] Admin mobile responsive layout
- [ ] Breadcrumb
- [ ] Admin notifications bell

## Admin - Dashboard
- [ ] Stats cards (sales, orders, users, products)
- [ ] Revenue chart (line/bar)
- [ ] Orders chart
- [ ] Top selling products table
- [ ] Recent orders table
- [ ] Low stock alerts
- [ ] Quick action buttons

## Admin - Product Management
- [ ] Products list (with search, filter, sort)
- [ ] Data table with bulk actions
- [ ] Add product page
- [ ] Edit product page
- [ ] Product variants management
- [ ] Product images management
- [ ] Product inventory view
- [ ] Product SEO settings
- [ ] Duplicate product
- [ ] Bulk import page
- [ ] Bulk export

## Admin - Category Management
- [ ] Categories list
- [ ] Add category page
- [ ] Edit category page
- [ ] Sub categories management
- [ ] Category reorder (drag and drop)

## Admin - Order Management
- [ ] Orders list (with filters by status, date, payment)
- [ ] Order detail page
- [ ] Update order status
- [ ] Print invoice
- [ ] Bulk status update
- [ ] Export orders

## Admin - User Management
- [ ] Users list
- [ ] User detail page
- [ ] User order history
- [ ] Activate/Deactivate user
- [ ] Export users

## Admin - Coupon Management
- [ ] Coupons list
- [ ] Add coupon page
- [ ] Edit coupon page
- [ ] Coupon usage stats

## Admin - Inventory Management
- [ ] Inventory list
- [ ] Stock update form
- [ ] Low stock list
- [ ] Out of stock list
- [ ] Inventory log
- [ ] Bulk stock update

## Admin - Review Management
- [ ] Reviews list
- [ ] Approve review
- [ ] Reject review
- [ ] Delete review
- [ ] Filter by rating, product, status

## Admin - Report Pages
- [ ] Sales report with date range
- [ ] Revenue report
- [ ] Orders report
- [ ] Products report
- [ ] Customers report
- [ ] Export all reports

## Admin - CMS Management
- [ ] Pages list
- [ ] Add/Edit page
- [ ] Banners list
- [ ] Add/Edit banner
- [ ] Blog list
- [ ] Add/Edit blog
- [ ] FAQ list
- [ ] Add/Edit FAQ

## Admin - Subscription Management
- [ ] Plans list
- [ ] Add/Edit plan
- [ ] Subscribers list
- [ ] Subscription detail

## Admin - Notification Management
- [ ] Send notification to user
- [ ] Send bulk notification
- [ ] Notification history

## Admin - Settings Pages
- [ ] General settings
- [ ] Store information
- [ ] Payment settings
- [ ] Shipping settings
- [ ] Email settings
- [ ] SMS settings
- [ ] SEO settings
- [ ] Social media links
- [ ] Theme settings
- [ ] Feature flags toggle

## Admin - Multi-Tenant (Super Admin)
- [ ] Tenants list
- [ ] Add tenant
- [ ] Edit tenant
- [ ] Suspend tenant
- [ ] Tenant stats
- [ ] Platform settings


# 📌 PHASE 6 — INTEGRATIONS

## Payment
- [ ] Razorpay order creation
- [ ] Razorpay payment verification
- [ ] Razorpay webhook
- [ ] Razorpay refund API
- [ ] COD flow
- [ ] Payment receipt PDF

## Shipping
- [ ] Shiprocket authentication
- [ ] Auto shipment creation on order confirm
- [ ] AWB generation
- [ ] Shipment tracking API
- [ ] Delivery webhook
- [ ] Pincode check API

## Email (SendGrid)
- [ ] SendGrid setup
- [ ] All email templates HTML design
- [ ] Welcome email template
- [ ] Verification email template
- [ ] Password reset email template
- [ ] Order confirmation email template
- [ ] Order shipped email template
- [ ] Order delivered email template
- [ ] Order cancelled email template
- [ ] Refund email template
- [ ] Subscription email template
- [ ] Newsletter template

## SMS (MSG91)
- [ ] MSG91 setup
- [ ] OTP template
- [ ] Order SMS template
- [ ] Shipping SMS template

## Media (Cloudinary)
- [ ] Upload preset setup
- [ ] Direct upload from frontend
- [ ] Auto optimization
- [ ] Responsive sizes
- [ ] Image deletion

## Search (MeiliSearch)
- [ ] MeiliSearch setup
- [ ] Product index setup
- [ ] Search API integration
- [ ] Autocomplete integration
- [ ] Filters configuration
- [ ] Re-indexing job

## Cache (Redis)
- [ ] Redis connection setup
- [ ] Product list caching
- [ ] Category caching
- [ ] Cart caching
- [ ] Session caching
- [ ] Cache invalidation strategy

## Analytics
- [ ] Google Analytics 4 setup
- [ ] Page view tracking
- [ ] Add to cart event
- [ ] Purchase event
- [ ] Search event
- [ ] Facebook Pixel setup

## Error Tracking
- [ ] Sentry setup (backend)
- [ ] Sentry setup (frontend)
- [ ] Error alerts configuration

## Background Jobs
- [ ] Hangfire / Quartz.NET setup
- [ ] Low stock check job (daily)
- [ ] Subscription renewal job (daily)
- [ ] Abandoned cart email job
- [ ] Order auto-cancel job (COD unpaid)
- [ ] Report generation job
- [ ] Cache warm up job
- [ ] MeiliSearch re-index job


# 📌 PHASE 7 — TESTING

## Backend Tests
- [ ] Unit tests for all services
- [ ] Integration tests for all APIs
- [ ] Auth flow test
- [ ] Payment flow test
- [ ] Order flow test
- [ ] Multi-tenant isolation test
- [ ] Feature flag test
- [ ] Edge case tests
- [ ] Load test (k6)

## Frontend Tests
- [ ] Component unit tests
- [ ] Page tests
- [ ] Form validation tests
- [ ] API integration tests
- [ ] Cross browser tests
- [ ] Mobile responsiveness tests

## E2E Tests
- [ ] Registration to order flow
- [ ] Admin product management flow
- [ ] Payment success flow
- [ ] Payment failure flow
- [ ] Coupon apply flow
- [ ] Return request flow
- [ ] Multi-tenant brand switch test

## Security Tests
- [ ] SQL injection check
- [ ] XSS check
- [ ] JWT security check
- [ ] Rate limiting check
- [ ] CORS check
- [ ] HTTPS check
- [ ] Tenant isolation check
- [ ] API authorization check


# 📌 PHASE 8 — DEPLOYMENT & DEVOPS

## Docker Setup
- [ ] Backend Dockerfile
- [ ] Frontend Dockerfile
- [ ] Admin Dockerfile
- [ ] Docker compose for local dev
- [ ] Docker compose for production

## CI/CD Pipeline (GitHub Actions)
- [ ] Lint check on PR
- [ ] Type check on PR
- [ ] Unit tests on PR
- [ ] Build check on PR
- [ ] Auto deploy frontend to Vercel on main
- [ ] Auto deploy backend to Azure on main
- [ ] Auto run migrations on deploy
- [ ] Slack/Email notification on deploy

## Environment Management
- [ ] Local (.env.local)
- [ ] Development (.env.development)
- [ ] Staging (.env.staging)
- [ ] Production (.env.production)
- [ ] Secrets management (GitHub Secrets / Azure Key Vault)

## Production Deployment
- [ ] Frontend deploy (Vercel)
- [ ] Admin deploy (Vercel)
- [ ] Backend deploy (Azure App Service / Render)
- [ ] Database setup (Neon/Supabase)
- [ ] Redis setup (Upstash)
- [ ] MeiliSearch setup (cloud)
- [ ] Domain DNS configuration
- [ ] SSL configuration
- [ ] CDN configuration

## Pre Launch Checklist
- [ ] All env variables set
- [ ] Migrations run on production
- [ ] Seed data loaded
- [ ] SSL active
- [ ] Domain working
- [ ] Payment live keys configured
- [ ] Email sending working
- [ ] SMS sending working
- [ ] Image upload working
- [ ] Search working
- [ ] Admin panel working
- [ ] All pages loading
- [ ] PWA installable
- [ ] Error tracking active
- [ ] Monitoring active
- [ ] Backup configured


# 📌 PHASE 9 — POST LAUNCH

## Monitoring Setup
- [ ] Sentry error tracking live
- [ ] UptimeRobot uptime monitoring
- [ ] Database monitoring
- [ ] API performance monitoring
- [ ] Alert notifications setup

## SEO Setup
- [ ] Meta tags all pages
- [ ] OG tags
- [ ] Sitemap.xml generation
- [ ] Robots.txt
- [ ] Schema markup products
- [ ] Core Web Vitals check
- [ ] Page speed optimization

## Performance Optimization
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] API response caching
- [ ] Database query optimization
- [ ] CDN static assets
- [ ] Lighthouse score check

## Security Hardening
- [ ] API rate limiting production
- [ ] HTTPS enforce
- [ ] Security headers
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secrets rotation plan


# 📊 PROGRESS SUMMARY
- Total Completed: 15 tasks ✅
- Currently In: Phase 0 → Phase 3
- Next Priority: Shared packages + Database + Backend architecture