-- Seed: Sample data for development and testing
-- Insert sample users
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Johnson', 'bob@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, stock) VALUES
    ('Laptop Pro', 999.99, 10),
    ('Wireless Mouse', 29.99, 50),
    ('USB-C Cable', 9.99, 100),
    ('Monitor 27"', 299.99, 5),
    ('Mechanical Keyboard', 149.99, 20)
ON CONFLICT DO NOTHING;
