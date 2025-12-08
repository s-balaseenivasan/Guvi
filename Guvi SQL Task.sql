CREATE DATABASE ecommerce;
USE ecommerce;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2),
    description TEXT
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO customers (name, email, address) VALUES
('Alice Johnson', 'alice@example.com', '123 Main St'),
('Bob Smith', 'bob@example.com', '456 Oak Ave'),
('Charlie Brown', 'charlie@example.com', '789 Pine Rd');

INSERT INTO products (name, price, description) VALUES
('Product A', 30.00, 'Description for Product A'),
('Product B', 55.50, 'Description for Product B'),
('Product C', 40.00, 'Description for Product C'),
('Product D', 75.00, 'Description for Product D');

INSERT INTO orders (customer_id, order_date, total_amount) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 120.00),
(2, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 200.00),
(1, DATE_SUB(CURDATE(), INTERVAL 40 DAY), 90.00);

-- Retrieve all customers who placed an order in the last 30 days
SELECT DISTINCT c.*
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Get the total amount of all orders placed by each customer
SELECT c.name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;

-- Update the price of Product C to 45.00
UPDATE products
SET price = 45.00
WHERE name = 'Product C';

-- Add a new column discount to the products table
ALTER TABLE products
ADD COLUMN discount DECIMAL(5,2) DEFAULT 0.00;

-- Retrieve the top 3 highest-priced products
SELECT * FROM products
ORDER BY price DESC
LIMIT 3;

-- Create order_items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1, 1, 2),  
(2, 2, 1),
(2, 1, 1);


-- Get names of customers who have ordered Product A
SELECT DISTINCT c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.name = 'Product A';

-- Join orders & customers to retrieve customer name + order date
SELECT c.name AS customer_name, o.order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- Retrieve orders with total amount > 150.00
SELECT * FROM orders
WHERE total_amount > 150.00;

-- Retrieve the average total of all orders
SELECT AVG(total_amount) AS avg_order_total
FROM orders;