import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../config/db.js", () => ({
    default: {
        query: mockQuery,
    },
}));

const { default: app } = await import("../app.js");

describe("Cart API", () => {
    beforeEach(() => {
        process.env.JWT_SECRET = "test_secret";
        mockQuery.mockReset();
    });

    test("GET /api/cart devuelve items y total", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    product_id: 10,
                    quantity: 2,
                    nombre: "Aura Glow Serum",
                    descripcion: "Serum facial",
                    precio: "10000.00",
                    imagen_url: "/images/serum.jpg",
                    subtotal: "20000.00",
                },
                {
                    id: 2,
                    product_id: 11,
                    quantity: 1,
                    nombre: "Aura Glow Cream",
                    descripcion: "Crema facial",
                    precio: "5000.00",
                    imagen_url: "/images/cream.jpg",
                    subtotal: "5000.00",
                },
            ],
        });

        const res = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.items).toHaveLength(2);
        expect(res.body.total).toBe(25000);
    });

    test("POST /api/cart agrega producto nuevo", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery
            .mockResolvedValueOnce({
                rows: [{ id: 10, stock: 5 }],
            })
            .mockResolvedValueOnce({
                rows: [],
            })
            .mockResolvedValueOnce({
                rows: [{ id: 1, user_id: 1, product_id: 10, quantity: 2 }],
            });

        const res = await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                product_id: 10,
                quantity: 2,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Producto agregado al carrito");
        expect(res.body.item.quantity).toBe(2);
    });

    test("POST /api/cart actualiza cantidad si el producto ya existe", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery
            .mockResolvedValueOnce({
                rows: [{ id: 10, stock: 10 }],
            })
            .mockResolvedValueOnce({
                rows: [{ id: 1, user_id: 1, product_id: 10, quantity: 2 }],
            })
            .mockResolvedValueOnce({
                rows: [{ id: 1, user_id: 1, product_id: 10, quantity: 4 }],
            });

        const res = await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                product_id: 10,
                quantity: 2,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Cantidad del producto actualizada en el carrito");
        expect(res.body.item.quantity).toBe(4);
    });

    test("POST /api/cart retorna 404 si el producto no existe", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                product_id: 999,
                quantity: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Producto no encontrado");
    });

    test("POST /api/cart retorna 400 si supera el stock", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery
            .mockResolvedValueOnce({
                rows: [{ id: 10, stock: 1 }],
            })
            .mockResolvedValueOnce({
                rows: [],
            });

        const res = await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                product_id: 10,
                quantity: 3,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("La cantidad solicitada supera el stock disponible");
    });

    test("PUT /api/cart/:productId actualiza quantity", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery
            .mockResolvedValueOnce({
                rows: [{ id: 10, stock: 10 }],
            })
            .mockResolvedValueOnce({
                rows: [{ id: 1, user_id: 1, product_id: 10, quantity: 3 }],
            });

        const res = await request(app)
            .put("/api/cart/10")
            .set("Authorization", `Bearer ${token}`)
            .send({
                quantity: 3,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Cantidad actualizada correctamente");
        expect(res.body.item.quantity).toBe(3);
    });

    test("DELETE /api/cart/:productId elimina producto del carrito", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({
            rows: [{ id: 1, user_id: 1, product_id: 10, quantity: 2 }],
        });

        const res = await request(app)
            .delete("/api/cart/10")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Producto eliminado del carrito");
    });

    test("DELETE /api/cart vacía el carrito", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .delete("/api/cart")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Carrito vaciado correctamente");
    });

    test("GET /api/cart retorna 401 sin token", async () => {
        const res = await request(app).get("/api/cart");

        expect(res.statusCode).toBe(401);
    });
});