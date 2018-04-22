USE bamazon_db;

SELECT products.product_name, departments.department_name, products.price, products.stock_quantity, products.product_sales
FROM products
LEFT JOIN departments
ON products.dept_id = departments.department_id;