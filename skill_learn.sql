-- ============================================================
-- Skill Learn - Portal de Cursos en Línea
-- Script de creación de base de datos para MySQL (XAMPP / phpMyAdmin)
-- Motor: InnoDB (soporta llaves foráneas)
-- Programación Web Capa Intermedia - Grupo 051
-- ============================================================

CREATE DATABASE IF NOT EXISTS skill_learn
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE skill_learn;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo     VARCHAR(150)    NOT NULL,
  genero              ENUM('femenino','masculino','otro') NOT NULL,
  fecha_nacimiento    DATE            NOT NULL,
  email               VARCHAR(150)    NOT NULL UNIQUE,
  password_hash       VARCHAR(255)    NOT NULL,
  avatar              VARCHAR(255)    NULL,
  rol                 ENUM('estudiante','instructor','administrador') NOT NULL,
  google_id           VARCHAR(100)    NULL UNIQUE COMMENT 'sub de Google Identity Services, si el usuario vinculó su cuenta de Google',
  intentos_fallidos    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  activo              BOOLEAN         NOT NULL DEFAULT TRUE COMMENT 'FALSE = deshabilitado por 3 intentos fallidos o por el administrador',
  fecha_registro      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_ultima_modificacion DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: categorias
-- ------------------------------------------------------------
CREATE TABLE categorias (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(100)    NOT NULL UNIQUE,
  descripcion         VARCHAR(500)    NULL,
  usuario_creador_id  INT             NOT NULL,
  fecha_creacion      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_categoria_usuario FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: cursos
-- ------------------------------------------------------------
CREATE TABLE cursos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id       INT             NOT NULL,
  titulo              VARCHAR(150)    NOT NULL,
  descripcion         TEXT            NOT NULL,
  imagen              VARCHAR(255)    NULL,
  precio_curso_completo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  es_gratis           BOOLEAN         NOT NULL DEFAULT FALSE,
  activo              BOOLEAN         NOT NULL DEFAULT TRUE COMMENT 'baja lógica del curso',
  fecha_creacion      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_baja          DATETIME        NULL,
  CONSTRAINT fk_curso_instructor FOREIGN KEY (instructor_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: curso_categoria (relación N a N: un curso pertenece a >= 1 categoría)
-- ------------------------------------------------------------
CREATE TABLE curso_categoria (
  curso_id      INT NOT NULL,
  categoria_id  INT NOT NULL,
  PRIMARY KEY (curso_id, categoria_id),
  CONSTRAINT fk_cc_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  CONSTRAINT fk_cc_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: niveles (cada nivel de un curso)
-- ------------------------------------------------------------
CREATE TABLE niveles (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  curso_id            INT             NOT NULL,
  numero_nivel        INT             NOT NULL,
  titulo              VARCHAR(150)    NOT NULL,
  descripcion         TEXT            NULL,
  precio_nivel        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  es_gratis           BOOLEAN         NOT NULL DEFAULT FALSE,
  video_youtube_id    VARCHAR(50)     NOT NULL COMMENT 'ID del video obligatorio en YouTube',
  CONSTRAINT fk_nivel_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  UNIQUE KEY uq_curso_numero_nivel (curso_id, numero_nivel)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: nivel_contenido (texto, PDF, imágenes, links adicionales por nivel)
-- ------------------------------------------------------------
CREATE TABLE nivel_contenido (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nivel_id      INT NOT NULL,
  tipo          ENUM('texto','pdf','imagen','link') NOT NULL,
  titulo        VARCHAR(150) NULL,
  contenido     TEXT NULL COMMENT 'texto libre o URL del archivo/enlace',
  orden         INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_contenido_nivel FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: inscripciones (kardex del alumno por curso)
-- ------------------------------------------------------------
CREATE TABLE inscripciones (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id       INT             NOT NULL,
  curso_id            INT             NOT NULL,
  fecha_inscripcion   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_ingreso DATETIME       NULL,
  fecha_terminacion   DATETIME        NULL,
  completado          BOOLEAN         NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_inscripcion_estudiante FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
  CONSTRAINT fk_inscripcion_curso FOREIGN KEY (curso_id) REFERENCES cursos(id),
  UNIQUE KEY uq_estudiante_curso (estudiante_id, curso_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: progreso_niveles (avance del alumno nivel por nivel)
-- ------------------------------------------------------------
CREATE TABLE progreso_niveles (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  inscripcion_id    INT NOT NULL,
  nivel_id          INT NOT NULL,
  fecha_completado  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_progreso_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_progreso_nivel FOREIGN KEY (nivel_id) REFERENCES niveles(id),
  UNIQUE KEY uq_inscripcion_nivel (inscripcion_id, nivel_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: pagos (compra de curso completo o de un nivel)
-- ------------------------------------------------------------
CREATE TABLE pagos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  inscripcion_id      INT             NOT NULL,
  nivel_id            INT             NULL COMMENT 'NULL si el pago fue por el curso completo',
  monto               DECIMAL(10,2)   NOT NULL,
  forma_pago          ENUM('paypal','tarjeta') NOT NULL,
  referencia_externa  VARCHAR(100)    NULL COMMENT 'ID de la orden/transacción en la pasarela de pago',
  estado              ENUM('pendiente','completado','fallido') NOT NULL DEFAULT 'pendiente',
  fecha_pago          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pago_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(id),
  CONSTRAINT fk_pago_nivel FOREIGN KEY (nivel_id) REFERENCES niveles(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: certificados
-- ------------------------------------------------------------
CREATE TABLE certificados (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  inscripcion_id    INT NOT NULL UNIQUE,
  nombre_alumno     VARCHAR(150) NOT NULL,
  nombre_curso      VARCHAR(150) NOT NULL,
  nombre_certifica  VARCHAR(150) NOT NULL,
  fecha_terminacion DATETIME NOT NULL,
  fecha_generado    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_certificado_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: comentarios (comentario + calificación de un curso terminado)
-- ------------------------------------------------------------
CREATE TABLE comentarios (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  curso_id              INT NOT NULL,
  usuario_id            INT NOT NULL,
  comentario            TEXT NOT NULL,
  calificacion          TINYINT UNSIGNED NOT NULL COMMENT 'escala 1 a 5',
  fecha_creacion        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminado             BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_eliminacion     DATETIME NULL,
  causa_eliminacion     VARCHAR(255) NULL,
  CONSTRAINT fk_comentario_curso FOREIGN KEY (curso_id) REFERENCES cursos(id),
  CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: mensajes (mensajería privada alumno <-> instructor)
-- ------------------------------------------------------------
CREATE TABLE mensajes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  curso_id        INT NULL,
  remitente_id    INT NOT NULL,
  destinatario_id INT NOT NULL,
  mensaje         TEXT NOT NULL,
  fecha_hora      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mensaje_curso FOREIGN KEY (curso_id) REFERENCES cursos(id),
  CONSTRAINT fk_mensaje_remitente FOREIGN KEY (remitente_id) REFERENCES usuarios(id),
  CONSTRAINT fk_mensaje_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: reportes_usuario (reportar a un usuario, ej. desde el chat)
-- ------------------------------------------------------------
CREATE TABLE reportes_usuario (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  usuario_reportado_id  INT NOT NULL,
  usuario_reporta_id    INT NOT NULL,
  motivo                TEXT NOT NULL,
  evidencia             VARCHAR(255) NULL,
  fecha_creacion        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reporte_reportado FOREIGN KEY (usuario_reportado_id) REFERENCES usuarios(id),
  CONSTRAINT fk_reporte_reporta FOREIGN KEY (usuario_reporta_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;
