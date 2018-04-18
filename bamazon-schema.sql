-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL (15,3),
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE("blue t-shirt", "clothing", 7.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE("dozen rocky ankle socks", "clothing", 6.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
  ("file cabinet", "office furniture", 80.00, 10),
  ("desk", "office furniture", 120.00, 5),
  ("letter envelopes 50 pack", "stationery", 3.99, 40),
  ("blender", "kitchen appliance", 45.00, 30),
  ("toaster", "kitchen appliance", 26.99, 40),
  ("stapler", "office supply", 12.99, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE("white v-neck t-shirt", "clothing", 4.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE("desk chair", "office furniture", 65.00, 10);
