// ===========================================================================================
//
//  File name: bamazonSupervisor.js
//  Description:
//  Date: April, 2018
//  Author: Fabian Flores
//
// ===========================================================================================

const PAD_ITEM_ID = 8;
const PAD_PRODUCT_NAME = 30;
// const PAD_PRICE = 10;
const PAD_QTY = 6;
const PRICE_DECIMAL = 2;
const LOW_STOCK_VAL = 5;

var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require("table");

require("colors");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "dbuser",

	// Your password
	password: "",
	database: "bamazon_db"
});



// IEEF function
(function() {
	// -----------------------------------------------------------------------------------------
	// connectToDatabase() connects to the bamazon_db database
	//
	function connectToDatabase() {
		connection.connect(function(err) {
			if (err) throw err;
		});
		function beginSpr() {
			startBamSpr();
		}
		return beginSpr;
	}

	var startBamSpr = function () {
		inquirer.prompt([

			{
				type: "list",
				name: "userChoice",
				message: "Please choose one",
				choices: [ "VIEW PRODUCT SALES BY DEPARTMENT", "CREATE NEW DEPARTMENT", "EXIT BAMAZON"]
			}

		// After the prompt, store the user's response in a variable called location.
		]).then(function(answer) {
			switch(answer.userChoice) {
			case "VIEW PRODUCT SALES BY DEPARTMENT":
				viewProductSalesByDept();
				break;
			case "CREATE NEW DEPARTMENT":
				createNewDept();
				break;
			case "EXIT BAMAZON":
				console.log("Leaving bamazon Supervisor... Thank you!".green);
				connection.end();
				break;
			default:
				console.log("No valid option selected.");
				break;
			}
		});

	};

	// -----------------------------------------------------------------------------------------
	// viewProductSalesByDept() 
	//
	function viewProductSalesByDept() {
		var query = 
			"SELECT dept.department_id, dept.department_name, dept.overhead_costs, SUM(prod.product_sales) AS \
			product_sales, SUM(prod.product_sales) - dept.overhead_costs AS total_profit \
			FROM products AS prod \
			LEFT JOIN departments AS dept \
			ON prod.dept_id = dept.department_id	\
			GROUP BY prod.dept_id";

		connection.query(query, function(err, res) {
			var output, config, innerArr = [], data = [];
			if (err) throw err;

			config = {
				columns: {
					0: {
						alignment: "center"
					},
					1: {
						alignment: "left"
					},
					2: {
						alignment: "right"
					},
					3: {
						alignment: "right"
					},
					4: {
						alignment: "right"
					}
				}
			};

			data.push(Object.keys(res[0]));
			for (const item of res) {
				innerArr.push(item.department_id.toString(), 
					item.department_name.toUpperCase(),
					item.overhead_costs.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$"),
					item.product_sales.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$"),
					item.total_profit.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$")
				);
				data.push(innerArr);
				innerArr = [];
			}

			output = table(data, config);
			console.log(output);
			startBamSpr();
		});
	}

	// -----------------------------------------------------------------------------------------
	// createNewDept() displays products that have a low ( < 5) inventory
	//
	function createNewDept() {
		var query ="SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < ?";
	
		connection.query(query, [LOW_STOCK_VAL], function(err, res) {
			if (err) throw err;
	
			console.log("=============== LOW INVENTORY REPORT ================".bold.blue);
			console.log("=====================================================".bold.blue);
			console.log("ITEM ID".padStart(PAD_ITEM_ID).bold.yellow + 
			"PRODUCT NAME  ".padStart(PAD_PRODUCT_NAME - PAD_QTY).bold.yellow + 
			"            QUANTITY ".padStart(PAD_QTY).bold.yellow);
			for (const product of res) {
				console.log(
					product.item_id.toString().padStart(PAD_ITEM_ID) + " | " + 
					product.product_name.toUpperCase().padEnd(PAD_PRODUCT_NAME) + " | " +
					product.stock_quantity.toString().padStart(PAD_QTY)
				);
			}
			console.log("=====================================================".bold.blue);
			startBamSpr();
		});
	}


	var startBamazonSpr = connectToDatabase();

	startBamazonSpr();

})();
