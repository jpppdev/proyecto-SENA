CREATE TABLE IF NOT EXISTS contratos_laborales (
    id_contrato SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    estado_vinculo VARCHAR(50) DEFAULT 'Activo',
    observaciones TEXT,
    CONSTRAINT fk_usuario_contrato FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);