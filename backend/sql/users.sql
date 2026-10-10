USE desi_20251;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS materials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO materials (name, category)
SELECT samples.name, samples.category
FROM (
  SELECT 'Material 1' AS name, 'Limpeza' AS category
  UNION ALL
  SELECT 'Material 2', 'Higiene'
  UNION ALL
  SELECT 'Material 3', 'Equipamentos'
) AS samples
WHERE NOT EXISTS (
  SELECT 1 FROM materials WHERE materials.name = samples.name
);

CREATE TABLE IF NOT EXISTS material_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  user_id INT NOT NULL,
  content VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comments_material_created (material_id, created_at)
) CHARACTER SET utf8mb4;