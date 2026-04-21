# Jaegar Resto - Smart POS & Inventory Management System

A modern, responsive Full-Stack Point of Sale (POS) and Inventory Management system designed for high-performance restaurant environments. Built with the MERN stack (MongoDB, Express, React, Node.js) and NestJS for a robust, modular backend.

---

## 🚀 Key Features

### **1. POS & Ordering Interface**
* **Dynamic Menu:** Filterable categories (Hot Dishes, Cold Dishes, Soup, etc.) with real-time search capabilities.
* **Order Customization:** Detailed modal for tailoring dishes with specific ingredients and preferences.
* **Responsive Cart:** Live calculation of subtotal, tax, and total. On mobile, the cart transitions into a smooth slide-out drawer.
* **Order Type Selection:** Support for 'Dine In', 'To Go', and 'Delivery' workflows.

### **2. Admin Management Dashboard**
* **Live Analytics:** Dashboard overview featuring Total Revenue, Order Volume, and Customer count.
* **Order Tracking:** Monitor incoming orders with status updates (Pending, Completed).
* **Most Ordered Dishes:** Automated tracking of top-performing menu items.
* **Dish Statistics:** Visual breakdown of order types using donut charts.

### **3. Inventory & Recipe Control**
* **Material Tracking:** Real-time stock management for raw ingredients.
* **Recipe Composition:** Link specific materials to dishes to track ingredient depletion automatically.
* **Dish Management:** Full CRUD operations for adding, editing, and deleting menu items with image uploads via Cloudinary.

### **4. Security & Authentication**
* **JWT Protected:** Secure login and signup with JSON Web Tokens.
* **Role-Based Access:** Distinct permissions for Admin (settings/inventory) and User (POS/ordering) roles.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Lucide React, Axios |
| **Backend** | NestJS 11, TypeScript, Express Adapter |
| **Database** | MongoDB Atlas, Mongoose |
| **Storage** | Cloudinary (Image Hosting) |
| **Deployment** | Vercel (Serverless Functions) |

---

## 🏗️ Technical Architecture

The system follows a **Decoupled Client-Server Architecture**:
* **Thin Client:** The Next.js frontend handles state-heavy UI operations like the live cart, filtering logic, and responsive drawer animations.
* **Fat Server:** The NestJS backend is the "brain," handling ingredient-to-dish math (Recipe Logic), secure authentication, and database orchestration.
* **Serverless Execution:** The backend is optimized for Vercel, using a specialized handler to bridge NestJS with Vercel's serverless runtime.

---

## 📁 Project Structure

```text
.
├── backend/                # NestJS Application
│   ├── src/
│   │   ├── auth/           # JWT & Auth logic
│   │   ├── products/       # Dish & Category modules
│   │   ├── orders/         # Transaction logic
│   │   ├── materials/      # Inventory management
│   │   └── main.ts         # Serverless entry point
│   └── .vercel.json        # Backend deployment config
└── frontend/               # Next.js Application
    ├── src/
    │   ├── components/     # UI: Navbar, Sidebar, ProductCards
    │   └── app/            # App Router: Dashboard, Admin, Login
    └── tailwind.config.ts  # Styling configuration
