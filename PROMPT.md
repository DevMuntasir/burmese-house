# Codex Master Prompt — Sanity Headless Ecommerce

Build a complete production-ready ecommerce web application inspired by the overall UI/UX structure and shopping flow of https://www.femelabd.com, but do not copy their branding, logo, product images, text, or copyrighted assets.

The project is for Bangladesh and must be simple, fast, mobile-first, and easy to maintain.

## IMPORTANT ARCHITECTURE DECISION

Use **Sanity as the Headless CMS and Admin Portal**.

Do NOT build a separate custom admin dashboard in Next.js.

All admin-side management must be done from **Sanity Studio**.

The Next.js application should contain only:

- Public ecommerce storefront
- Product browsing
- Product detail pages
- Search
- Categories
- Cart
- Buy Now
- Checkout
- Manual bKash payment submission
- Customer authentication
- Customer account portal
- Order history
- Order details
- Order tracking

Sanity Studio will be responsible for:

- Products
- Categories
- Product variants
- Product inventory
- Orders
- Customers where appropriate
- Manual bKash payment verification
- Banners
- Homepage content
- Store settings
- Shipping configuration
- Payment configuration
- Order status management

---

## 1. Technology Stack

Use:

- Next.js latest stable version
- App Router
- TypeScript
- Tailwind CSS
- Sanity.io
- Sanity Studio
- GROQ
- next-sanity
- Zod
- React Hook Form where useful
- Better Auth, Clerk, Supabase Auth, or another reliable authentication option
- Lucide icons
- Server Components where appropriate
- Server Actions / Route Handlers where appropriate

Do not use Prisma or PostgreSQL for ecommerce content unless authentication absolutely requires a separate database.

The main ecommerce database/CMS must be Sanity.

Prefer keeping the architecture as simple as possible.

---

## 2. Overall Architecture

Use:

```text
Next.js
    |
    |-- Storefront
    |-- Product pages
    |-- Search
    |-- Cart
    |-- Checkout
    |-- Customer portal
    |-- APIs / Server Actions
    |
    --> Sanity API
            |
            |-- Products
            |-- Categories
            |-- Orders
            |-- Payments
            |-- Banners
            |-- Settings
            |-- Customers
            |-- Inventory
```

Admin users work only through Sanity Studio.

Do not create `/admin` pages inside Next.js.

---

## 3. Project Structure

Use approximately:

```text
app/
  (store)/
    page.tsx

    products/
      page.tsx
      [slug]/
        page.tsx

    category/
      [slug]/
        page.tsx

    search/
      page.tsx

    cart/
      page.tsx

    checkout/
      page.tsx

    order-success/
      [orderId]/
        page.tsx

    track-order/
      page.tsx

  account/
    page.tsx

    orders/
      page.tsx

      [id]/
        page.tsx

    profile/
      page.tsx

    addresses/
      page.tsx

  api/
    orders/
    payments/
    auth/

components/
  layout/
  storefront/
  product/
  cart/
  checkout/
  account/
  shared/
  ui/

lib/
  sanity/
    client.ts
    queries.ts
    mutations.ts
    image.ts
    types.ts

  auth/
  validations/
  utils/
  cart/
```

Sanity Studio can either live:

```text
/studio
```

inside the same repository,

or as:

```text
sanity/
```

Use whichever structure is cleaner and easier to deploy.

---

## 4. Sanity Schema Design

Create proper Sanity schemas.

Required document types:

```text
product
category
order
customer
banner
storeSettings
shippingSettings
paymentSettings
homepageSettings
```

Use objects where appropriate:

```text
productVariant
orderItem
address
paymentDetails
seo
```

---

## 5. Product Schema

Create a robust `product` schema.

Fields:

```text
title
slug
shortDescription
description

images[]

category

sku

regularPrice
salePrice

isFeatured
isBestSeller
isNewArrival

active

stockManagement
stockQuantity

soldCount

variants[]

seo

createdAt
```

Use Sanity portable text for detailed description if appropriate.

Images should use Sanity Image assets.

Do not use Cloudinary unless there is a strong reason.

---

## 6. Product Variants

Products may have:

- Color
- Size
- Other options

Support variant combinations.

Example:

```text
Color: Black
Size: M
SKU: SHIRT-BLK-M
Stock: 10
Price: 1200
```

Variant object:

```text
{
  title
  sku
  options
  stock
  priceAdjustment
  image
  active
}
```

The storefront must correctly detect variant stock availability.

Unavailable combinations must not be purchasable.

---

## 7. Category Schema

Fields:

```text
name
slug
image
description
active
sortOrder
featured
```

Products should reference categories.

Admin should be able to reorder categories from Sanity.

---

## 8. Homepage Management

Do not hardcode homepage content.

Create a `homepageSettings` Sanity document.

Admin should be able to configure:

- Hero banners
- Featured categories
- Featured products
- Best sellers
- New arrivals
- Promotional banners
- Category-based product sections
- Section ordering
- Enable/disable homepage sections

Homepage should automatically render based on Sanity content.

---

## 9. Banner Management

Create `banner` documents.

Fields:

```text
title
subtitle
image
mobileImage
link
buttonText
active
sortOrder
startDate
endDate
```

Homepage banner carousel should pull active banners from Sanity.

---

## 10. Store Settings

Create singleton:

```text
storeSettings
```

Fields:

```text
storeName
logo
favicon

phone
email
whatsapp

address

facebook
instagram
tiktok

footerText

currency
```

Currency default:

```text
BDT
```

Display prices as:

```text
৳1,250
```

---

## 11. Shipping Settings

Create singleton:

```text
shippingSettings
```

Admin should configure:

```text
insideDhakaCharge
outsideDhakaCharge

freeShippingEnabled
freeShippingMinimum

deliveryInformation
```

Checkout must read these values dynamically from Sanity.

Do not hardcode delivery prices.

---

## 12. Payment Settings

Create singleton:

```text
paymentSettings
```

Fields:

```text
cashOnDeliveryEnabled

bkashEnabled

bkashNumber
bkashAccountType

bkashInstructions
```

Example:

```text
bKash Number:
01XXXXXXXXX

Account Type:
Personal
```

Frontend checkout must use these values dynamically.

---

## 13. Storefront UI

Use Femela BD only as UX inspiration.

The design should feel:

- Clean
- White/light background
- Product-focused
- Minimal
- Fast
- Mobile-first
- Commercial
- Bangladesh ecommerce friendly

Do not create a generic SaaS design.

Avoid:

- excessive gradients
- glassmorphism
- huge rounded cards
- excessive animations
- unnecessary dashboard-like components

Use:

- clean typography
- subtle borders
- strong product images
- compact cards
- clear product prices
- clear CTA buttons

---

## 14. Header

Desktop:

- Logo
- Navigation
- Search
- Account
- Cart

Navigation:

```text
Home
All Products
Categories
Offers
Track Order
```

Mobile:

- Hamburger menu
- Logo
- Search
- Account
- Cart

Cart icon must show item count.

---

## 15. Homepage

Homepage sections:

1. Announcement bar
2. Header
3. Hero banner
4. Category shortcuts
5. Featured Products
6. Best Selling
7. New Arrivals
8. Dynamic category product sections
9. Promotional banners
10. Footer

All relevant content should come from Sanity.

---

## 16. Product Card

Product card should contain:

- Product image
- Product title
- Sale price
- Regular price
- Discount
- Optional sold count
- Out of stock state

If no sale price exists:

show only regular price.

If sale price exists:

show:

```text
৳1,250
৳1,500
```

with regular price struck through.

Clicking product opens product details.

---

## 17. Product Detail Page

Desktop:

Left:

- Main image
- Thumbnail gallery
- Multiple images
- Responsive image display

Right:

- Product title
- SKU
- Current price
- Old price
- Savings
- Sold count
- Stock status
- Variant selectors
- Quantity selector
- Add to Cart
- Buy Now

Variant changes must update:

- Stock
- SKU
- Price
- Image where available

Below:

- Description
- Specifications
- Delivery information
- Return information
- Related products

---

## 18. Cart

Support:

- Guest cart
- Persistent cart
- Product
- Selected variant
- Quantity
- Price
- Remove
- Update quantity

Use localStorage or cookies for guest cart.

Cart should survive reload.

Show:

```text
Subtotal
Estimated delivery
Grand Total
```

Shipping can be finalized during checkout.

---

## 19. Buy Now

Buy Now should send the currently selected product directly to checkout.

Do not overwrite the user's regular cart.

Use a separate buy-now checkout state.

---

## 20. Checkout

Create a one-page checkout.

Required customer fields:

```text
Full Name
Mobile Number
District
Area / Thana
Full Address
```

Optional:

```text
Email
Order Note
```

Validate Bangladeshi phone numbers.

Example accepted format:

```text
01XXXXXXXXX
```

Logged-in customer details should automatically prefill where possible.

Guest checkout must be supported.

---

## 21. Delivery Charge

Customer selects:

```text
Inside Dhaka
Outside Dhaka
```

Delivery charge must come from Sanity shipping settings.

Example:

```text
Inside Dhaka
৳80

Outside Dhaka
৳130
```

Do not hardcode these values.

---

## 22. Payment Methods

Support:

```text
Cash on Delivery
Manual bKash
```

Payment methods should be enabled/disabled from Sanity.

---

## 23. Manual bKash Flow

This is a critical feature.

When customer selects:

```text
bKash Manual Payment
```

Display:

```text
Send Money To

bKash Personal
01XXXXXXXXX

Amount:
৳1,250
```

Show instructions from Sanity.

Customer must enter:

```text
Sender bKash Number
Transaction ID
```

Validate both fields.

Transaction ID must not be empty.

Store Transaction ID in the order.

---

## 24. Order Schema

Create `order` Sanity document.

Fields should include:

```text
orderNumber

customerReference optional
guestCustomer

customerName
phone
email

shippingAddress

items[]

subtotal
shippingCharge
discount
total

paymentMethod

payment

paymentStatus
orderStatus

customerNote
adminNote

createdAt
updatedAt
```

Generate human-readable order numbers.

Example:

```text
ORD-20260825-1048
```

Do not expose Sanity `_id` as the public order number.

---

## 25. Order Item Snapshot

Very important:

Do not only reference live product data inside an order.

Store a snapshot of purchased product information.

Each order item should contain:

```text
productReference
productTitle
productSlug
image
sku

selectedVariants

unitPrice
quantity
lineTotal
```

This ensures historical orders remain correct even if a product is later edited.

---

## 26. Payment Object

Inside order:

```text
payment: {
  method
  senderNumber
  transactionId
  submittedAmount
  verifiedAt
  verifiedBy
}
```

Payment statuses:

```text
UNPAID
VERIFICATION_PENDING
PAID
REJECTED
REFUNDED
```

For manual bKash order:

default:

```text
VERIFICATION_PENDING
```

For COD:

default:

```text
UNPAID
```

---

## 27. Order Status

Use:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

Payment status and order status must remain separate.

Never mix them into a single field.

---

## 28. Sanity Order Management

Since Sanity Studio is the admin portal, customize the `order` schema UI so admins can easily manage orders.

Admin must be able to see:

- Order number
- Customer name
- Customer phone
- Products
- Total
- Payment method
- bKash sender number
- Transaction ID
- Payment status
- Order status
- Order date

Structure the Sanity order document cleanly using fieldsets/groups.

Suggested groups:

```text
Order
Customer
Items
Payment
Delivery
Status
Internal
```

---

## 29. Sanity Order List

Customize Studio document list so orders display useful information.

Prefer titles like:

```text
ORD-20260825-1048 — Rahim
```

Subtitle:

```text
৳1,250 • bKash • Verification Pending
```

Sort newest orders first.

Provide useful filters where possible:

- Pending
- Payment verification pending
- Processing
- Shipped
- Delivered
- Cancelled

Use Sanity Structure Builder if needed.

---

## 30. Manual bKash Verification in Sanity

Admin opens an order in Sanity.

They should clearly see:

```text
Payment Method:
bKash

Sender:
017XXXXXXXX

Transaction ID:
ABC123XYZ

Amount:
৳1,250

Payment Status:
Verification Pending
```

Admin can change:

```text
Verification Pending
→ Paid
```

or:

```text
Verification Pending
→ Rejected
```

Customer portal must reflect changes automatically.

---

## 31. Duplicate Transaction Protection

When placing a bKash order, check whether the submitted transaction ID is already used by another order.

If duplicate:

reject checkout with:

```text
This Transaction ID has already been submitted.
```

Perform this check server-side.

Do not rely only on frontend validation.

Because Sanity does not provide traditional SQL unique constraints, implement a GROQ query/server-side duplicate lookup before creating the order.

---

## 32. Inventory

Inventory must be manageable from Sanity.

If product has no variants:

use:

```text
stockQuantity
```

If variants exist:

stock should be controlled per variant.

Frontend must prevent customers from ordering quantities beyond available stock.

---

## 33. Inventory Update After Order

When an order is successfully created:

reduce appropriate product/variant stock.

Implement this server-side.

Use Sanity transactions where possible to reduce race conditions.

Do not allow stock to become negative.

Keep implementation understandable and maintainable.

---

## 34. Customer Authentication

Customer account must be optional.

Do not require registration before checkout.

Support:

- Guest checkout
- Customer login
- Customer registration

Customer portal:

```text
/account
/account/orders
/account/orders/[id]
/account/profile
```

---

## 35. Customer Portal

Customer dashboard should show:

- Recent orders
- Pending orders
- Completed orders

Order list:

```text
Order #
Date
Total
Payment Status
Order Status
View
```

Order detail page:

- Products
- Variants
- Quantity
- Prices
- Address
- Shipping charge
- Total
- Payment method
- Transaction ID
- Payment status
- Order status
- Order timeline

---

## 36. Order Timeline

Show:

```text
Order Placed
↓
Confirmed
↓
Processing
↓
Shipped
↓
Delivered
```

Highlight current status.

Handle cancelled orders properly.

Payment status should appear separately.

---

## 37. Guest Order Tracking

Create:

```text
/track-order
```

Customer can enter:

```text
Order Number
Phone Number
```

If both match an order, display:

- Order summary
- Payment status
- Order status
- Timeline

Do not reveal an order using only the order ID.

Require phone verification matching the order.

---

## 38. Search

Search should support:

- Product title
- Category
- SKU
- Keywords

Implement using GROQ initially.

Do not introduce Algolia unless genuinely necessary.

Add search suggestions if practical.

---

## 39. SEO

Implement:

- Product metadata
- Category metadata
- Dynamic title
- Dynamic description
- Open Graph images
- Canonical URLs
- Sitemap
- robots.txt

Use Sanity product SEO fields.

---

## 40. Performance

Use:

- Next.js Image
- Sanity image CDN
- Proper image dimensions
- Image placeholders where appropriate
- Server Components
- Cached GROQ queries
- Revalidation

Avoid unnecessary client-side fetching.

Use client components only when interaction requires them.

---

## 41. Sanity Live Updates / Revalidation

When admin updates:

- Product
- Category
- Banner
- Settings

the storefront should update correctly.

Use Next.js revalidation strategy.

If necessary configure Sanity webhooks later, but keep architecture ready for it.

For development, reasonable time-based revalidation is acceptable.

---

## 42. Sanity Security

Never expose a Sanity write token publicly.

Read-only public queries may use safe public configuration.

All order creation and mutations must happen server-side.

Environment variables:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION

SANITY_API_WRITE_TOKEN
```

Do not expose:

```text
SANITY_API_WRITE_TOKEN
```

to the browser.

---

## 43. Checkout Security

Never trust prices coming from frontend/cart state.

When creating an order:

server must re-fetch products from Sanity.

Recalculate:

```text
product prices
variant prices
subtotal
shipping
total
```

on the server.

Ignore client-provided final totals.

This is mandatory.

---

## 44. Order Creation Flow

Implement approximately:

```text
Customer checkout
        ↓
Validate form
        ↓
Fetch latest products from Sanity
        ↓
Validate product availability
        ↓
Validate variants
        ↓
Validate stock
        ↓
Calculate trusted prices
        ↓
Calculate shipping
        ↓
Validate bKash transaction if applicable
        ↓
Check duplicate transaction ID
        ↓
Create order
        ↓
Decrease stock
        ↓
Clear checkout/cart
        ↓
Show order success
```

Prefer Sanity transaction operations where appropriate.

---

## 45. Order Success

After order creation show:

```text
Thank You!

Your order has been placed.

Order Number:
ORD-20260825-1048
```

Show:

- Total
- Payment method
- Payment status
- Order tracking CTA

For bKash:

```text
Payment Submitted
Waiting for Verification
```

For COD:

```text
Cash on Delivery
```

---

## 46. Sanity Studio UX

Sanity Studio is not just raw schemas.

Make it pleasant for non-technical admins.

Use:

- Good field titles
- Helpful descriptions
- Validation
- Field groups
- Initial values
- Custom previews
- Logical ordering
- Singleton documents
- Clean navigation

Studio navigation should approximately be:

```text
Dashboard / Content

Products
Categories

Orders
  All Orders
  Payment Verification
  Pending
  Processing
  Shipped
  Delivered
  Cancelled

Banners

Homepage

Store Settings
Shipping Settings
Payment Settings
```

Use Structure Builder.

---

## 47. Sanity Product Management Experience

Admin should be able to create/edit a product without dealing with confusing raw objects.

Organize product editor into:

```text
Basic Information
Pricing
Images
Inventory
Variants
Homepage / Merchandising
Description
SEO
```

Add proper field validation.

Examples:

```text
title required

regularPrice > 0

salePrice <= regularPrice

slug required

stock cannot be negative
```

---

## 48. Product Deletion

Prefer:

```text
active = false
```

or archive behavior instead of permanent deletion where products may already exist in orders.

Historical orders must never break because a product was removed.

---

## 49. Responsive Design

Test:

```text
375px
390px
768px
1024px
1440px
```

Primary priority:

mobile.

Make:

- header
- product grid
- product page
- cart
- checkout
- account

excellent on phone screens.

---

## 50. UI States

Implement proper:

- Loading
- Empty
- Error
- Out of stock
- No search results
- Empty cart
- Payment pending
- Order not found

Use skeleton loading where appropriate.

Do not leave broken blank states.

---

## 51. Toast / Feedback

Provide feedback for:

```text
Added to cart
Cart updated
Removed from cart
Order placed
Invalid transaction ID
Duplicate transaction ID
Out of stock
Login success
Profile updated
```

Keep messages concise.

---

## 52. Code Quality

Requirements:

- Strong TypeScript types
- No unnecessary `any`
- Reusable functions
- Reusable components
- Clear naming
- Clean folder organization
- No huge monolithic components
- No duplicated pricing logic
- Server-side business logic
- Clear comments only where necessary

Generate Sanity-derived TypeScript types if practical.

---

## 53. Development Seed Data

Add example content for development:

Categories:

```text
Women's Fashion
Travel Accessories
Beauty & Personal Care
Home & Lifestyle
```

Products:

at least 8–12 realistic placeholder products.

Do not use Femela copyrighted images.

Use neutral placeholder images or Sanity test images.

Add:

- banners
- shipping settings
- payment settings
- store settings

---

## 54. Environment Setup

Create:

```text
.env.example
```

Document every variable required.

Also create:

```text
README.md
```

with exact setup instructions:

1. Install dependencies
2. Create/connect Sanity project
3. Configure dataset
4. Add environment variables
5. Run Sanity Studio
6. Add seed content
7. Run Next.js
8. Production build
9. Deployment instructions

---

## 55. Deployment

Target deployment:

```text
Vercel
```

Sanity remains hosted by Sanity.

Ensure the application works correctly in production.

Do not depend on local filesystem storage.

---

## 56. Implementation Phases

Do not try to build everything chaotically.

Implement in this order.

### Phase 1

Project foundation:

- Next.js
- TypeScript
- Tailwind
- Sanity
- Studio
- Environment configuration
- Shared layout

Verify build works.

### Phase 2

Sanity schemas:

- Product
- Category
- Banner
- Homepage
- Store settings
- Shipping settings
- Payment settings

Create good Studio UX.

### Phase 3

Storefront:

- Header
- Footer
- Homepage
- Category pages
- Product cards
- Product detail

Connect everything to real Sanity data.

### Phase 4

Cart:

- Add to cart
- Variants
- Quantity
- Cart persistence
- Cart drawer
- Cart page

### Phase 5

Checkout:

- Customer fields
- Delivery
- COD
- Manual bKash
- Server-side calculations

### Phase 6

Orders:

- Sanity order schema
- Order creation
- Product snapshots
- Payment statuses
- Order statuses
- Stock updates

### Phase 7

Sanity order management:

- Custom previews
- Order filtering
- Payment verification
- Status management

### Phase 8

Customer authentication:

- Register
- Login
- Profile

### Phase 9

Customer portal:

- Orders
- Order detail
- Order status
- Payment status

### Phase 10

Guest order tracking.

### Phase 11

SEO, performance, validation and security.

### Phase 12

Full responsive polish and production testing.

---

## 57. Required Testing

Before considering the project complete, manually test:

### Product

- Product loads
- Sale price works
- Variants work
- Out-of-stock variants blocked

### Cart

- Add
- Remove
- Quantity update
- Reload persistence

### Checkout

- Required validation
- Phone validation
- Shipping calculation
- COD order
- bKash order

### bKash

- Missing transaction ID rejected
- Missing sender number rejected
- Duplicate transaction ID rejected
- Verification pending displayed

### Sanity

- Order appears
- Admin sees Transaction ID
- Payment status can change
- Order status can change

### Customer

- Order appears in account
- Payment status updates
- Order status updates

### Tracking

- Correct order + phone works
- Wrong phone does not reveal order

### Inventory

- Correct stock decreases
- Cannot order beyond stock

### Responsive

- Mobile
- Tablet
- Desktop

---

## 58. Important Development Behavior

When implementing this project:

Do not just generate placeholder UI.

Actually connect every completed feature to Sanity.

Do not leave fake arrays after Sanity integration.

Do not create mock admin pages.

Sanity Studio IS the admin portal.

After every major phase:

- run TypeScript checks
- run lint
- run production build
- fix all errors before proceeding

Do not knowingly leave broken code.

---

## 59. Final Target

The finished application should feel like a streamlined Bangladesh ecommerce website inspired by Femela BD.

Customer side:

```text
Homepage
   ↓
Category/Product
   ↓
Product Detail
   ↓
Add to Cart / Buy Now
   ↓
Checkout
   ↓
COD / Manual bKash
   ↓
Order Created
   ↓
Track Order / Customer Account
```

Admin side:

```text
Sanity Studio
   ↓
Products
Categories
Inventory
Orders
Payment Verification
Order Status
Banners
Homepage
Shipping
Payment Settings
Store Settings
```

The main priorities are:

1. Excellent mobile UX
2. Very simple customer journey
3. Sanity-powered content/admin
4. Secure server-side checkout
5. Simple manual bKash payment
6. Easy order management
7. Maintainable code
8. Production readiness

Start by inspecting the existing repository.

If the repository is empty, initialize the project.

If code already exists, preserve good existing architecture and refactor only where necessary.

Then implement Phase 1 and continue sequentially through all phases without waiting for confirmation between phases unless a required external credential is genuinely missing.
