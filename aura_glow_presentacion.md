# 🛍️ Presentación E-commerce Aura Glow

## 1. ¿Qué hicimos? (Funcional)
Desarrollamos un e-commerce de skincare llamado **Aura Glow**, donde los usuarios pueden:
- Registrarse e iniciar sesión  
- Ver productos organizados por categorías  
- Agregar productos al carrito  
- Visualizar el total de compra  
- Realizar compras  
- Administrar productos (modo admin)

👉 Es una tienda online completa con gestión de usuarios, productos y compras.

---

## 2. ¿Cómo funciona? (Funcional)
### Tipos de usuarios
- Cliente: navega, compra  
- Admin: gestiona productos  

### Flujo:
1. Usuario entra  
2. Se registra / login  
3. Navega productos  
4. Agrega al carrito  
5. Ve total  
6. Compra  

---

## 3. Login (Técnico)
### DB
- email (único)
- password (encriptado)
- rol

### Seguridad
- bcrypt para encriptar contraseñas
- comparación:
```javascript
bcrypt.compare(password, user.password)
```

### JWT
```javascript
jwt.sign({ id, email, rol }, SECRET)
```
Permite autenticar y proteger rutas.

---

## 4. Registro (Técnico)
1. Validación de datos  
2. Verificación de email único  
3. Encriptación:
```javascript
bcrypt.hash(password, 10)
```
4. Guardado en DB  

---

## 5. Perfil
- Se usa JWT desde headers
- Se obtiene ID
- Query:
```sql
SELECT * FROM users WHERE id = ?
```

---

## 6. Carrito
### Frontend
Array de productos:
```javascript
[{ id, nombre, precio, cantidad }]
```

### Total:
```javascript
carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
```

---

## 7. Comprar
Total = suma de productos

Ejemplo:
- 10.000 x 2 = 20.000  
- 5.000 x 1 = 5.000  

👉 Total = 25.000  

---

## 8. Categorías
Campo en DB:
```sql
categoria TEXT
```

Permite filtrar productos.

---

## 9. CRUD Productos

### CREATE
POST /api/products  

### READ
GET /api/products  

### UPDATE
PUT /api/products/:id  

### DELETE
DELETE /api/products/:id  

---

## Cierre
E-commerce completo con:
- autenticación segura  
- gestión de productos  
- carrito  
- control de roles  

👉 Simula una tienda real.
