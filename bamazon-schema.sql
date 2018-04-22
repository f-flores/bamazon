-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;

-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- products table --
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  dept_id INTEGER(11),
  price DECIMAL (15,3),
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

-- insert values into products table --
INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUE("blue t-shirt", 1, 7.99, 100);

INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUE("dozen rocky ankle socks", 1, 6.99, 50);

INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUES
  ("file cabinet", 2, 80.00, 20),
  ("desk", 2, 120.00, 10),
  ("letter envelopes 50 pack", 3, 3.99, 100),
  ("blender", 4, 45.00, 60),
  ("toaster", 4, 26.99, 80),
  ("stapler", 5, 12.99, 100);

INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUE("white v-neck t-shirt", 1, 4.99, 200);

INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUE("desk chair", 2, 65.00, 40);

-- create departments table --
CREATE TABLE  departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  overhead_costs DECIMAL (15,3),
  PRIMARY KEY(department_id)
);

-- insert values into departments table --
INSERT INTO departments (department_name, overhead_costs)
VALUES
  ("clothing", 300),
  ("office furniture", 600),
  ("stationery", 200),
  ("kitchen appliance", 400),
  ("office supply", 250);

  -- add column product_sales to products table --
  ALTER TABLE products ADD COLUMN product_sales DECIMAL(15,3) DEFAULT 0;