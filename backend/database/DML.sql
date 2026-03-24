-- =========================================
-- BASE DE DATOS AURA GLOW
-- Datos iniciales (DML)
-- =========================================

-- =========================================
-- TABLA: products
-- =========================================
INSERT INTO products (id, nombre, descripcion, precio, stock, categoria, imagen_url, created_at) VALUES
(1,  'Aura Glow Serum',   'Serum iluminador facial con efecto antioxidante', 12990.00, 10, 'Serums',  'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047763/serumrostro_g0p5yh.png', '2026-03-16 21:55:28.86212-03'),
(5,  'Crema Hidratante',  'Crema hidratante de uso diario',                   14990.00,  8, 'Cremas',  'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047766/cremarostro_yxrejd.png', '2026-03-21 23:46:24.639926-03'),
(6,  'Jabon Facial',      'Gel limpiador suave para el rostro',                9990.00, 12, 'Jabones', 'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047765/jabonRostro_mltu00.png', '2026-03-21 23:46:24.639926-03'),
(7,  'Tónico Facial',     'Tónico refrescante y equilibrante',                 8990.00, 15, 'Tonicos', 'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047764/tonicorostro_ln3lwb.png', '2026-03-21 23:46:24.639926-03'),
(8,  'Serum Poros',       'Serum para minimizar poros',                       15990.00,  6, 'Serums',  'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047872/serum_xfdmc2.jpg', '2026-03-21 23:46:24.639926-03'),
(9,  'Crema de perlas',   'Crema para todo tipo de piel',                     11990.00,  9, 'Cremas',  'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047872/cream_atc5mz.jpg', '2026-03-21 23:46:24.639926-03'),
(10, 'Tónico Hidratante', 'Tonico para todo tipo de piel',                    10990.00,  7, 'Tonicos', 'https://res.cloudinary.com/drwg9eumz/image/upload/v1774047872/tonic_gwnwyv.jpg', '2026-03-21 23:46:24.639926-03');

-- =========================================
-- TABLA: users
-- =========================================
INSERT INTO users (id, nombre, apellido, email, password, foto_perfil, created_at, rol) VALUES
(2, 'Carla',   'Zuñiga', 'carla@example.com',   '$2b$10$6qDd7ep2FRe7fpIYvsQOBOsjjY0BDsI36SwBYwB3fzT9OEZ.AVWlu', 'https://placehold.co/400', '2026-03-16 21:25:02.292104-03', 'admin'),
(4, 'Carla',   'Zuñiga', 'carla@test.com',      '$2b$10$yngawxqdtxOf.MSHWKPwS.EpR.wVh79hyIZhlxVudvl3pg4eYSnXO', 'https://placehold.co/400', '2026-03-21 20:49:38.243591-03', 'admin'),
(5, 'carla',   'test',   'test@test.com',       '$2b$10$YDzFj5ceYCjyovqLpMe1WuW6criudoumUW1kX4dVC1wYhHUEmFD5C', NULL,                      '2026-03-22 12:29:30.674618-03', 'cliente'),
(6, 'ana',     'perez',  'ana@test.com',        '$2b$10$AesaZGJeSXFwQtpj7TnsNOubba.VzFkmv0KDCDjSVFUgSJF3ju2Tu', NULL,                      '2026-03-23 16:58:22.403671-03', 'cliente');



-- =========================================
-- AJUSTE DE SECUENCIAS
-- =========================================
SELECT setval('cart_items_id_seq', 23, true);
SELECT setval('favorites_id_seq', 14, true);
SELECT setval('products_id_seq', 11, true);
SELECT setval('users_id_seq', 6, true);