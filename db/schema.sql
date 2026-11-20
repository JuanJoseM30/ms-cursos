-- db/schema.sql — base de datos de ms-cursos
SET NAMES utf8mb4;            -- para que las tildes y la ñ se guarden bien

CREATE TABLE IF NOT EXISTS cursos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(20)  NOT NULL UNIQUE,   -- regla: codigo único (409)
  nombre    VARCHAR(100) NOT NULL,
  creditos  INT          NOT NULL,          -- entre 1 y 6
  cupo      INT          NOT NULL,          -- mayor que 0
  semestre  VARCHAR(6)   NOT NULL           -- AAAA-1 o AAAA-2
);

-- Registros iniciales de prueba
INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre) VALUES
  ('RSM-101', 'Redes y Servicios Multimedia', 3, 30, '2026-2'),
  ('BDM-201', 'Bases de Datos Multimedia',    4, 25, '2026-2'),
  ('PRG-110', 'Programación Web',             3, 35, '2026-1');
