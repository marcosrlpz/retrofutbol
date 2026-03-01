# ⚽ RetroFútbol

> Tienda online de camisetas de fútbol retro — Proyecto final de Bootcamp Full Stack

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-15%20passing-22c55e?style=flat-square&logo=jest&logoColor=white)](./backend/src/tests)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)

---

## 🌐 Demo

| Frontend | Backend API |
|----------|------------|
| 🔗 `https://retrofutbol.vercel.app` *(próximamente)* | 🔗 `https://retrofutbol-api.onrender.com` *(próximamente)* |

---

## 📸 Capturas

> *(Añade capturas aquí una vez desplegado)*

---

## 📋 Descripción

**RetroFútbol** es una plataforma e-commerce completa para la compra de camisetas de fútbol retro y vintage. Desarrollada como proyecto final de bootcamp Full Stack, implementa todas las funcionalidades de una tienda real: catálogo con filtros, carrito de compra, personalización de camisetas, gestión de pedidos, panel de administración y mucho más.

---

## ✨ Funcionalidades

### 🛒 Tienda
- Catálogo de **+119 camisetas** con búsqueda en tiempo real y filtros (liga, equipo, temporada, precio)
- Carrito de compra persistente por usuario
- **Personalizador de camisetas** — nombre, número y parche (+5€)
- Checkout con zonas de envío (España peninsular, Baleares, Canarias, Portugal, Europa)
- Envío gratuito en pedidos superiores a 75€
- Wishlist (lista de favoritos) sincronizada en base de datos

### 👤 Usuarios
- Registro y login con JWT
- Google reCAPTCHA v2 en el registro
- Recuperación de contraseña por email con token seguro
- Perfil con historial de pedidos (en curso / finalizados / cancelados)
- Cancelación de pedidos y confirmación de recepción

### ⭐ Reviews
- Sistema de valoraciones (1-5 estrellas)
- Solo pueden valorar usuarios que han comprado y recibido el producto
- Distribución de puntuaciones con barras

### 🔧 Panel de Administración
- Dashboard con gráficas (ingresos, categorías, productos más vendidos)
- Gestión completa de productos (CRUD + subida de imágenes a Cloudinary)
- Gestión de pedidos con cambio de estado y notificaciones por email
- Gestión de usuarios (roles, eliminación)
- Alertas de stock bajo
- Paginación completa (20 productos por página)

### 📧 Sistema de Emails (Nodemailer)
- Confirmación de pedido al cliente y al admin
- Notificación de envío
- Confirmación de cancelación
- Formulario de contacto
- Recuperación de contraseña

### 🎨 UX/UI
- Diseño responsive (mobile-first)
- Animaciones con Framer Motion
- Skeletons de carga
- Barra de anuncios rotativos
- Banner de cookies
- Botón de WhatsApp flotante
- SEO dinámico con react-helmet-async
- Open Graph para redes sociales
- Página 404 personalizada

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Uso |
|-----------|-----|
| Node.js + Express | Servidor y API REST |
| MongoDB + Mongoose | Base de datos |
| JWT | Autenticación |
| bcrypt | Hash de contraseñas |
| Nodemailer | Envío de emails |
| Cloudinary | Almacenamiento de imágenes |
| Jest + Supertest | Testing |

### Frontend
| Tecnología | Uso |
|-----------|-----|
| React 18 + Vite | Framework y bundler |
| React Router v6 | Enrutamiento |
| Styled Components | Estilos |
| Framer Motion | Animaciones |
| React Hook Form | Formularios |
| Recharts | Gráficas del dashboard |
| Axios | Peticiones HTTP |
| React Hot Toast | Notificaciones |

---

## 🗄️ Modelo de Base de Datos

```
User
├── name, lastname, email, password (bcrypt)
├── role: "user" | "admin"
├── city, phone
├── wishlist: [Product._id]
└── resetPasswordToken, resetPasswordExpires

Product
├── name, description, price, stock
├── category, brand, temporada, gender, color
├── image_url (Cloudinary)
└── averageRating, numReviews

Order
├── user: User._id
├── items: [{ product, quantity, price, customization }]
├── total, shippingCost
├── address: { street, city, postalCode, zone }
├── paymentMethod
└── status: pending | processing | shipped | delivered | cancelled

Review
├── product: Product._id
├── user: User._id
├── rating (1-5)
└── comment
```

---

## 🚀 Instalación y uso local

### Requisitos
- Node.js 18+
- MongoDB Atlas (o local)
- Cuenta de Cloudinary
- Cuenta de Gmail con App Password

### 1. Clonar el repositorio

```bash
git clone https://github.com/marcosrlpz/retrofutbol.git
cd retrofutbol
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` en `/backend`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/styleshop
JWT_SECRET=tu_jwt_secret_aqui
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

EMAIL_USER=pedidos.retrofutbol@gmail.com
EMAIL_PASS=tu_app_password_gmail
EMAIL_FROM=RetroFútbol <pedidos.retrofutbol@gmail.com>
ADMIN_EMAIL=pedidos.retrofutbol@gmail.com

RECAPTCHA_SECRET=tu_recaptcha_secret

FRONTEND_URL=http://localhost:5173
```

Poblar la base de datos con los productos iniciales:

```bash
node seed.js
```

Iniciar el servidor:

```bash
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea el archivo `.env` en `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
```

Iniciar el frontend:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🧪 Tests

```bash
cd backend
npm test
```

**15 tests** cubriendo:
- ✅ Registro de usuario
- ✅ Login y autenticación JWT
- ✅ Rutas protegidas
- ✅ CRUD de productos (solo admin)
- ✅ Creación y consulta de pedidos

---

## 📁 Estructura del proyecto

```
retrofutbol/
├── backend/
│   ├── src/
│   │   ├── config/          # DB y Cloudinary
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middlewares/     # Auth y roles
│   │   ├── models/          # Schemas de Mongoose
│   │   ├── routes/          # Endpoints API
│   │   ├── services/        # Email service
│   │   └── tests/           # Jest + Supertest
│   ├── data/
│   │   └── products.csv     # Datos semilla
│   └── seed.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── admin/       # Componentes del panel admin
        │   ├── layout/      # Navbar, Footer, Layout
        │   └── ui/          # Componentes reutilizables
        ├── context/         # Auth, Cart, Wishlist
        ├── hooks/           # useFetch, useCart, useAuth...
        ├── pages/
        │   ├── admin/       # Dashboard, ManageProducts...
        │   └── ...          # Home, Products, Checkout...
        ├── services/        # Llamadas a la API
        └── styles/          # GlobalStyles y variables CSS
```

---

## 👤 Credenciales de demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | pedidos.retrofutbol@gmail.com | Retro2026! |
| Usuario | *(registrarse en la web)* | — |

---

## 📬 Contacto

**Marcos** — [@marcosrlpz](https://github.com/marcosrlpz)

Proyecto: [https://github.com/marcosrlpz/retrofutbol](https://github.com/marcosrlpz/retrofutbol)

---

<p align="center">Hecho con ❤️ y mucho ☕ — Bootcamp Full Stack 2026</p>