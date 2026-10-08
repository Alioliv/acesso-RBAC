
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock INT UNSIGNED NOT NULL DEFAULT 0
);

-- Execute apenas se a tabela estiver vazia.
INSERT INTO products (name, category, price, stock) VALUES
  ('Detergente neutro 500 ml', 'Limpeza', 3.49, 120),
  ('Desinfetante lavanda 2 L', 'Limpeza', 9.90, 60),
  ('Esponja multiuso', 'Utensílios', 2.50, 200),
  ('Pano de microfibra', 'Utensílios', 6.75, 80),
  ('Luva de borracha M', 'Proteção', 8.90, 45);