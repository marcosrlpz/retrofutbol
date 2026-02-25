# ⚽ RetroFútbol

> Tienda online de camisetas de fútbol retro. Las mejores camisetas de La Liga, Premier League, Serie A, Bundesliga y Selecciones nacionales.

![RetroFútbol](https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80)

---

## 📋 Descripción del proyecto

RetroFútbol es una aplicación fullstack de e-commerce especializada en camisetas de fútbol retro. Permite a los usuarios explorar un catálogo de camisetas organizadas por ligas y equipos, añadirlas al carrito y realizar pedidos. Los administradores disponen de un panel completo para gestionar el catálogo y los pedidos.

El proyecto nace de la pasión por el fútbol y la nostalgia de las camisetas icónicas de los años 80, 90 y 2000. Equipos como el Barcelona de Ronaldinho, el Manchester United del Triplete o la Argentina de Maradona tienen camisetas que son auténticas obras de arte del deporte.

---

## 🚀 Tecnologías utilizadas

### Backend
- **Node.js** + **Express** — servidor y API REST
- **MongoDB** + **Mongoose** — base de datos y ODM
- **JWT** — autenticación con tokens
- **bcryptjs** — cifrado de contraseñas
- **Cloudinary** + **Multer** — gestión de imágenes en la nube
- **csv-parser** — generación de datos desde CSV

### Frontend
- **React** + **Vite** — interfaz de usuario
- **React Router DOM** — navegación y rutas protegidas
- **Styled Components** — estilos con CSS-in-JS
- **React Hook Form** — formularios con validación
- **Axios** — peticiones HTTP
- **React Hot Toast** — notificaciones

---

## 📁 Estructura del proyecto

```
retrofutbol/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexión DB y Cloudinary
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middlewares/     # Auth y roles
│   │   ├── models/          # Esquemas MongoDB
│   │   ├── routes/          # Endpoints API
│   │   └── seeds/           # Datos iniciales desde CSV
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/              # Imágenes estáticas
│   └── src/
│       ├── components/      # Navbar, Footer, ProductCard...
│       ├── context/         # AuthContext, CartContext
│       ├── hooks/           # useFetch, useCart
│       ├── pages/           # Home, Products, Cart, Admin...
│       ├── services/        # Llamadas a la API
│       └── styles/          # Variables CSS globales
└── README.md
```

---

## 🗄️ Colecciones de MongoDB

### Users (30 documentos)
```js
{
  name, lastname, email, password (bcrypt),
  role: "admin" | "user",
  city, phone, timestamps
}
```

### Products (72 documentos)
```js
{
  name, description, price,
  category: "La Liga" | "Premier League" | "Serie A" | "Bundesliga" | "Otros Países" | "Selecciones",
  brand,        // nombre del equipo o selección
  temporada,    // ej: "1998-99"
  talla, color, gender, stock, rating,
  image_url, cloudinary_id, timestamps
}
```

### Orders
```js
{
  user: ObjectId,
  items: [{ product: ObjectId, quantity, price }],
  total, status, address, paymentMethod, timestamps
}
```

---

## 🔐 Autenticación y roles

| Rol | Permisos |
|-----|----------|
| **Usuario** | Explorar catálogo, carrito, checkout, mis pedidos, perfil |
| **Admin** | Todo lo anterior + gestión de camisetas y pedidos |

Credenciales de prueba:
- **Admin**: `maria1@email.com` / `password123`
- **Usuario**: `usuario1@email.com` / `password123`

---

## 📡 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login y obtención de token |
| GET | `/api/auth/me` | Datos del usuario autenticado |
| PUT | `/api/auth/me` | Actualizar perfil |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar camisetas (con filtros) |
| GET | `/api/products/:id` | Detalle de camiseta |
| POST | `/api/products` | Crear camiseta (admin) |
| PUT | `/api/products/:id` | Editar camiseta (admin) |
| DELETE | `/api/products/:id` | Eliminar camiseta (admin) |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/orders` | Crear pedido |
| GET | `/api/orders/my-orders` | Mis pedidos |
| GET | `/api/orders` | Todos los pedidos (admin) |
| PUT | `/api/orders/:id/status` | Actualizar estado (admin) |

---

## ⚙️ Instalación y uso

### Requisitos
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend
```bash
cd backend
npm install
# Configura el .env con tus credenciales
npm run seed:products   # Insertar camisetas
npm run seed:users      # Insertar usuarios
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# Crea .env con VITE_API_URL=http://localhost:5000/api
npm run dev             # http://localhost:5173
```

### Variables de entorno (.env backend)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
```

---

## ✨ Funcionalidades destacadas

- 🛒 **Carrito persistente** en localStorage con useReducer
- 🔐 **Rutas protegidas** por autenticación y rol
- 🖼️ **Subida de imágenes** a Cloudinary desde el panel admin
- 🔍 **Filtros** por liga, equipo, talla y precio
- 📱 **Diseño responsive** para móvil y escritorio
- ⚡ **Hook useFetch** personalizado con control de montaje
- 🎠 **Slider automático** en la página principal
- 📊 **Panel admin** con estadísticas en tiempo real
- 🌐 **Menús desplegables** por liga con todos los equipos

---

## 🚀 Despliegue

- **Backend**: [Render](https://render.com)
- **Frontend**: [Vercel](https://vercel.com)
- **Base de datos**: MongoDB Atlas
- **Imágenes**: Cloudinary

---

## 👨‍💻 Autor

**Marcos** — Proyecto final del bootcamp Rock the Code v2

---

## 📄 Licencia

MIT