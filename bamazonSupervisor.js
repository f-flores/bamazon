// ===========================================================================================
//
//  File name: bamazonSupervisor.js
//  Description:
//  Date: April, 2018
//  Author: Fabian Flores
//
// ===========================================================================================

const PRICE_DECIMAL = 2;

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
			var output, config, rowArr = [], data = [];
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
				rowArr.push(item.department_id.toString(), 
					item.department_name.toUpperCase(),
					item.overhead_costs.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$"),
					item.product_sales.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$"),
					item.total_profit.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$")
				);
				data.push(rowArr);
				rowArr = [];
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
		inquirer.prompt([
			{
				name: "newDpt",
				type: "input",
				message: "What department would like to add?",
				validate: function(value) {
					var msgText ="";

					if (typeof value === "string" && value.length > 0) {
						return true;
					}
					msgText = "\nPlease enter a valid department name.";
					console.log(msgText.bold.red);
					return false;
				} 
			},
			{
				name: "ovCosts",
				type: "input",
				message: "What is the overhead price for this department?",
				validate: function(value) {
					var msgText ="";

					if (isNaN(value) === false && value > 0) {
						return true;
					}
					msgText = "\nPlease enter a valid price.";
					console.log(msgText.bold.red);
					return false;
				}

			}
		]).then(function(answer) {
			// find out if department already exists		
			var query ="SELECT department_id FROM departments WHERE ?";
	
			connection.query(query, 
				[	{department_name: answer.newDpt }], function(err, res) {
					if (err) throw err;
	
					if (res.length > 0) {
						// department_name already exists, insert new item with existing department_id
						console.log("The " + answer.newDpt + " department already exists.");
						startBamazonSpr();
					} else {
						// else create new department_name and department_id
						connection.query("INSERT INTO departments SET ?", 
							[{
								department_name: answer.newDpt,
								overhead_costs: answer.ovCosts
							}], function(error) {
								if (error) throw error;
								console.log(answer.newDpt + " added successfully to departments database");
								startBamazonSpr();
							});
					}
				});

		});
	}


	var startBamazonSpr = connectToDatabase();

	startBamazonSpr();

})();
