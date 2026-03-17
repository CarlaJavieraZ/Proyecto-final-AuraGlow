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

describe("Favorites API", () => {
    beforeEach(() => {
        process.env.JWT_SECRET = "test_secret";
        mockQuery.mockReset();
    });

    test("GET /api/favorites devuelve favoritos del usuario", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    product_id: 10,
                    nombre: "Aura Glow Serum",
                    precio: "19990.00",
                    imagen_url: "/images/serum.jpg",
                },
            ],
        });

        const res = await request(app)
            .get("/api/favorites")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].nombre).toBe("Aura Glow Serum");
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    test("POST /api/favorites agrega producto a favoritos", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({
            rows: [{ id: 1, user_id: 1, product_id: 10 }],
        });

        const res = await request(app)
            .post("/api/favorites")
            .set("Authorization", `Bearer ${token}`)
            .send({ product_id: 10 });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Producto agregado a favoritos");
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    test("POST /api/favorites retorna 400 si falta product_id", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        const res = await request(app)
            .post("/api/favorites")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("product_id es obligatorio");
    });

    test("DELETE /api/favorites/:productId elimina favorito", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({
            rows: [{ id: 1, user_id: 1, product_id: 10 }],
        });

        const res = await request(app)
            .delete("/api/favorites/10")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Producto eliminado de favoritos");
    });

    test("DELETE /api/favorites/:productId retorna 404 si no existe", async () => {
        const token = jwt.sign(
            { id: 1, email: "carla@test.com" },
            process.env.JWT_SECRET
        );

        mockQuery.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .delete("/api/favorites/999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Favorito no encontrado");
    });

    test("GET /api/favorites retorna 401 sin token", async () => {
        const res = await request(app).get("/api/favorites");

        expect(res.statusCode).toBe(401);
    });
});