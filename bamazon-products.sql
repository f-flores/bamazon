USE bamazon_db;

SELECT dept.department_id, dept.department_name, dept.overhead_costs, SUM(prod.product_sales) AS product_sales, SUM(prod.product_sales) - dept.overhead_costs AS total_profit
FROM products AS prod
LEFT JOIN departments AS dept
ON prod.dept_id = dept.department_id
GROUP BY prod.dept_id;