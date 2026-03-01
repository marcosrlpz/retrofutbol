const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

// ── Conexión a BD de test ─────────────────────────────────────────────
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Limpia usuarios de test creados
  await mongoose.connection.collection("users").deleteMany({ email: /test_jest/ });
  await mongoose.disconnect();
});

// ─────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────
describe("🔐 Auth API", () => {

  const testUser = {
    name: "Jest",
    lastname: "Test",
    email: `test_jest_${Date.now()}@retrofutbol.com`,
    password: "test1234",
  };

  let authToken;

  // ── Registro ────────────────────────────────────────────────────────
  describe("POST /api/auth/register", () => {
    it("debe registrar un usuario nuevo y devolver token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.role).toBe("user");

      authToken = res.body.token;
    });

    it("debe rechazar registro con email duplicado", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/ya está registrado/i);
    });

    it("debe rechazar registro sin campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "incompleto@test.com" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ── Get Me ──────────────────────────────────────────────────────────
  describe("GET /api/auth/me", () => {
    it("debe devolver el usuario autenticado con token válido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("debe rechazar acceso sin token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.statusCode).toBe(401);
    });

    it("debe rechazar token inválido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer token_falso_123");

      expect(res.statusCode).toBe(401);
    });
  });

  // ── Forgot Password ─────────────────────────────────────────────────
  describe("POST /api/auth/forgot-password", () => {
    it("debe responder OK aunque el email no exista (seguridad)", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "noexiste@retrofutbol.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────────────────────────────
describe("👕 Products API", () => {

  // ── GET todos ───────────────────────────────────────────────────────
  describe("GET /api/products", () => {
    it("debe devolver lista de productos con paginación", async () => {
      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products");
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("page");
    });

    it("debe respetar el parámetro limit", async () => {
      const res = await request(app).get("/api/products?limit=3");

      expect(res.statusCode).toBe(200);
      expect(res.body.products.length).toBeLessThanOrEqual(3);
    });

    it("debe filtrar por liga/categoría", async () => {
      const res = await request(app).get("/api/products?league=La Liga");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });

  // ── GET por ID ──────────────────────────────────────────────────────
  describe("GET /api/products/:id", () => {
    it("debe devolver 404 con un ID inexistente", async () => {
      const res = await request(app).get("/api/products/000000000000000000000000");
      expect(res.statusCode).toBe(404);
    });

    it("debe devolver 500 o 400 con un ID malformado", async () => {
      const res = await request(app).get("/api/products/id_invalido");
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  // ── POST crear producto (sin admin) ─────────────────────────────────
  describe("POST /api/products (protegido)", () => {
    it("debe rechazar creación sin token", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Camiseta Test", price: 29.99 });

      expect(res.statusCode).toBe(401);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────
// RUTAS GENERALES
// ─────────────────────────────────────────────────────────────────────
describe("🌐 Rutas generales", () => {
  it("GET / debe responder con mensaje de API", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/RetroFútbol/i);
  });

  it("ruta inexistente debe devolver 404", async () => {
    const res = await request(app).get("/api/ruta-que-no-existe");
    expect(res.statusCode).toBe(404);
  });
});