import request from "supertest";
import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../config/db.js", () => ({
    default: {
        query: mockQuery,
    },
}));

const { default: app } = await import("../app.js");

describe("Products API", () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    test("GET /api/products devuelve lista de productos", async () => {
        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    nombre: "Aura Glow Serum",
                    descripcion: "Serum hidratante",
                    precio: "19990.00",
                    stock: 10,
                    categoria: "Skincare",
                    imagen_url: "/images/serum.jpg",
                    created_at: "2026-03-16T10:00:00.000Z",
                },
            ],
        });

        const res = await request(app).get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].nombre).toBe("Aura Glow Serum");
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    test("GET /api/products/:id devuelve 404 si no existe", async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const res = await request(app).get("/api/products/999");

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Producto no encontrado");
    });
});