import request from "supertest";
import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../config/db.js", () => ({
    default: {
        query: mockQuery,
    },
}));

const { default: app } = await import("../app.js");

describe("Auth API", () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    test("POST /api/auth/register crea un usuario", async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] }) // SELECT user exists
            .mockResolvedValueOnce({
                rows: [
                    {
                        id: 1,
                        nombre: "Carla",
                        apellido: "Zuñiga",
                        email: "carla@test.com",
                        foto_perfil: null,
                        created_at: "2026-03-16T10:00:00.000Z",
                    },
                ],
            });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                nombre: "Carla",
                apellido: "Zuñiga",
                email: "carla@test.com",
                password: "123456",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Usuario registrado correctamente");
        expect(res.body.user.email).toBe("carla@test.com");
        expect(res.body.token).toBeDefined();
    });

    test("POST /api/auth/register retorna 409 si el email ya existe", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1 }],
        });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                nombre: "Carla",
                apellido: "Zuñiga",
                email: "carla@test.com",
                password: "123456",
            });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("El correo ya está registrado");
    });
});