# MacroMeal

A full-stack food ordering app where vendors list meal items and customers order them with automatic calorie, protein, carb, and fat totals per order.

## Screenshots


## Description

MacroMeal lets three kinds of users work with the same set of meal items and orders, scoped by role:

- **Customers** browse the meal menu or individual restaurants, place orders, and see the total calories/protein/carbs/fat/price for every order they place.
- **Vendors** manage their own restaurant's meal items from a dashboard (create, edit, delete, availability), and have a public storefront page customers can browse.
- **Admins** manage every user's role and can update the status of any order platform-wide.

## Tech Stack

- Node.js / Express
- MongoDB / Mongoose
- EJS templating
- Tailwind CSS

## Getting Started

1. Clone the repo and `cd` into `auth-template`
2. `npm install`
3. Create a `.env` file with:
   ```
   MONGODB_URI=<your MongoDB connection string>
   SESSION_SECRET=<any random string>
   PORT=3000
   ```
4. `npm run dev` (uses nodemon) or `npm start`
5. Visit `http://localhost:3000`

## Routes

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/` | Homepage | Public |
| GET | `/auth/sign-up` | Sign up form | Public |
| POST | `/auth/sign-up` | Create account | Public |
| GET | `/auth/sign-in` | Sign in form | Public |
| POST | `/auth/sign-in` | Log in | Public |
| GET | `/auth/sign-out` | Log out | Signed in |
| GET | `/mealitems` | Meal menu (all available items) | Public |
| GET | `/mealitems/new` | New meal item form | Vendor/Admin |
| POST | `/mealitems` | Create meal item | Vendor/Admin |
| GET | `/mealitems/dashboard` | Vendor's own meal items | Vendor/Admin |
| GET | `/mealitems/:id` | Meal item details | Public |
| GET | `/mealitems/:id/edit` | Edit meal item form | Owner |
| PUT | `/mealitems/:id` | Update meal item | Owner |
| DELETE | `/mealitems/:id` | Delete meal item | Owner/Admin |
| GET | `/vendors` | Restaurant directory | Public |
| GET | `/vendors/:id` | Vendor's public storefront | Public |
| GET | `/orders` | My orders | Signed in |
| GET | `/orders/new` | New order form | Signed in |
| POST | `/orders` | Place order | Signed in |
| GET | `/orders/:id` | Order details | Owner |
| GET | `/orders/:id/edit` | Edit order form | Owner |
| PUT | `/orders/:id` | Update order | Owner |
| DELETE | `/orders/:id` | Delete order | Owner |
| GET | `/admin` | Admin dashboard | Admin |
| GET | `/admin/users` | Manage user roles | Admin |
| PUT | `/admin/users/:id/role` | Update a user's role | Admin |
| GET | `/admin/orders` | View all orders | Admin |
| PUT | `/admin/orders/:id/status` | Update an order's status | Admin |

## Future Enhancements

- Vendor meal item approval workflow (schema already has an `approved` field, unused for now)
- Image uploads for meal items and restaurants
- Search/filter on the meal menu (category, price range)
- Order status notifications for customers
