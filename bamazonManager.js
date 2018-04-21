// ===========================================================================================
//
//  File name: bamazon.js
//  Description:
//  Date: April, 2018
//  Author: Fabian Flores
//
// ===========================================================================================

const PAD_ITEM_ID = 8;
const PAD_PRODUCT_NAME = 30;
const PAD_PRICE = 10;
const PAD_QTY = 6;
const PRICE_DECIMAL = 2;
const LOW_STOCK_VAL = 5;

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

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
		function beginMgr() {
			startBamMgr();
		}
		return beginMgr;
	}

	var startBamMgr = function () {
		inquirer.prompt([

			{
				type: "list",
				name: "userChoice",
				message: "Please choose one",
				choices: [ "VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", 
					"ADD TO PRODUCT", "EXIT BAMAZON"]
			}

		// After the prompt, store the user's response in a variable called location.
		]).then(function(answer) {
			switch(answer.userChoice) {
			case "VIEW PRODUCTS FOR SALE":
				viewProductsForSale();
				break;
			case "VIEW LOW INVENTORY":
				viewLowInventory();
				break;
			case "ADD TO INVENTORY":
				addToInventory();
				break;
			case "ADD TO PRODUCT":
				addToProduct();
				break;
			case "EXIT BAMAZON":
				console.log("Leaving bamazon Manager... Thank you!".green);
				connection.end();
				break;
			default:
				console.log("No valid option selected.");
				break;
			}
		});

	};

	// -----------------------------------------------------------------------------------------
	// viewProductsForSale() produces report of item id's, product name, price and quantity
	//
	function viewProductsForSale() {
		var query;
	
		console.log("==================== PRODUCTS FOR SALE =========================".bold.blue);
		console.log("ITEM ID".padStart(PAD_ITEM_ID).bold.yellow +
			"   PRODUCT NAME  ".padStart(PAD_PRODUCT_NAME).bold.yellow + 
			"        PRICE  ".padStart(PAD_PRICE).bold.yellow +
			"   QUANTITY ".padStart(PAD_QTY).bold.yellow);
		console.log("================================================================".bold.blue);
		query = 
		connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
			if (err) throw err;
	
			for (const product of res) {
				console.log(
					product.item_id.toString().padStart(PAD_ITEM_ID) + " | " + 
					product.product_name.toUpperCase().padStart(PAD_PRODUCT_NAME) + " | " +
					product.price.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$").padStart(PAD_PRICE) + " | " +
					product.stock_quantity.toString().padStart(PAD_QTY)
				);
			}
			console.log("================================================================".bold.blue);
			startBamMgr();
		});
	}

	// -----------------------------------------------------------------------------------------
	// viewLowInventory() displays products that have a low ( < 5) inventory
	//
	function viewLowInventory() {
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
			startBamMgr();
		});
	}

	// -----------------------------------------------------------------------------------------
	// addToInventory() displays products and lets manager add inventory
	//
	function addToInventory() {
		var query = "SELECT item_id, product_name FROM products";

		connection.query(query, function(err, res) {
			/* 
			 * getChoiceList returns list of products 
			 */
			function getChoiceList() {
				var chText = "", choices = [];

				if (err) throw err;

				for (const item of res) {
					chText = "ID: " + item.item_id + ",PRODUCT: " + item.product_name;
					choices.push(chText);
				}
			
				return choices;
			}

			inquirer.prompt([
				{
					type: "list",
					name: "chosenProduct",
					message: "Add more of which product?",
					choices: getChoiceList()
				},
				{
					type: "input",
					name: "stockToAdd",
					message: "How many would you like to add?"
				}
			]).then(function(answer) {
				var arr = [], idProd = "", nameProd = "";
				arr = answer.chosenProduct.split(",");
				idProd = parseInt(arr[0].slice("ID: ".length));
				nameProd = arr[1].slice("PRODUCT: ".length);
				connection.query(
					"UPDATE products SET stock_quantity = stock_quantity +  ? WHERE ?",
					[
						parseInt(answer.stockToAdd),
						{
							item_id: idProd
						}
					],
					function(error) {
						if (error) throw err;
						console.log("Updated stock quantity for " + nameProd + " successfully!");
						startBamazonMgr();
					});
			});
		});

	//	});
	}

	function addToProduct() {
		console.log("add to product");
		startBamMgr();
	}

	var startBamazonMgr = connectToDatabase();

	startBamazonMgr();

})();