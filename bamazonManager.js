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
					chText = "ID: " + item.item_id + ", PRODUCT: " + item.product_name;
					choices.push(chText.magenta);
				}
			
				return choices;
			}

			inquirer.prompt([
				{
					type: "list",
					name: "idProduct",
					message: "Add more of which product?",
					choices: getChoiceList()
				},
				{
					type: "input",
          name: "stockToAdd",
          message: "How many would you like to add?"
        }
			]).then(function(answer) {
				console.log("You chose " + answer.idProduct);
				/* retrieves product name and stock quantity of current item id */
				// function getProductName() {
				//	var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
				//	connection.query(query, { item_id: data.idProduct }, function(err, res) {
				//		if (err) throw err;
				//		purchaseItem.idProduct = data.idProduct;
				//		purchaseItem.productPrice = res[0].price,
				//		purchaseItem.productName =  res[0].product_name;
				//		purchaseItem.productQty = res[0].stock_quantity;
				//		promptPurchaseQty(purchaseItem);
				//	});
				startBamMgr();
			}
			// getProductName();
			// }
			);
		});

	//	});
	}

	function addToProduct() {
		console.log("add to product");
		startBamMgr();
	}
	// ------------------------------------------------------------------------------------------
	// displayItems() shows all the items, including ids, names, and prices of products for sale
	//
	/* 	function displayItems() {
		var query;
	
		console.log("ITEM ID".padStart(PAD_ITEM_ID).bold.yellow +
			"   PRODUCT NAME  ".padStart(PAD_PRODUCT_NAME).bold.yellow + 
			"        PRICE  ".padStart(PAD_PRICE).bold.yellow );
		console.log("=======================================================".bold.blue);
		query = 
		connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
			for (const product of res) {
				console.log(
					product.item_id.toString().padStart(PAD_ITEM_ID) + " | " + 
					product.product_name.toUpperCase().padStart(PAD_PRODUCT_NAME) + " | " +
					product.price.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$").padStart(PAD_PRICE)
				);
			}
			console.log("======================================================".bold.blue);
			getPurchaseOptions();
		});
	}
 */
	// ------------------------------------------------------------------------------------------
	// getPurchaseOptions() The first should ask them the ID of the product they would like to buy.
	// The second message should ask how many units of the product they would like to buy.
	//
	/* 	function getPurchaseOptions() {
		var purchaseItem = {
			idProduct: 0,
			productPrice: 0, 
			numProducts: 0,
			productName: "",
			productQty: 0
		}; */
				
	/* get total number of ids */
	/* 		function getNumProducts() {
			connection.query("SELECT COUNT(item_id) AS total_items, item_id FROM products", function(err, res) {
				if (err) throw err;
				purchaseItem.numProducts =  res[0].total_items;
			});
		}

		getNumProducts();
		inquirer.prompt([
			{
				type: "input",
				name: "idProduct",
				message: "What is the id of the product you would like to buy?",
				validate: function(value) {
					var msgText = "";

					if (value > 0 && value <= purchaseItem.numProducts) {
						return true;
					} else {
						msgText = "Invalid input. Please enter valid product id. ";
						msgText += "Valid values between 1 and " + purchaseItem.numProducts.toString();
						return msgText.bold.red;
					}
				}
			}
		]).then(function(data) { */
	/* retrieves product name and stock quantity of current item id */
	/* 			function getProductName() {
				var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
				connection.query(query, { item_id: data.idProduct }, function(err, res) {
					if (err) throw err;
					purchaseItem.idProduct = data.idProduct;
					purchaseItem.productPrice = res[0].price,
					purchaseItem.productName =  res[0].product_name;
					purchaseItem.productQty = res[0].stock_quantity;
					promptPurchaseQty(purchaseItem);
				});
			}
			getProductName();
		});
	}
 */
	// ------------------------------------------------------------------------------------------
	// promptPurchaseQty() asks the user how many were chosen and the quantity the user wishes
	//	to purchase of that item
	//
	/* 	function promptPurchaseQty(product) {
		console.log("Product chosen: " + JSON.stringify(product));

		inquirer.prompt([
			{
				type: "input",
				name: "qty",
				message: "How many " + product.productName + "(s) would you like to purchase?",
				validate: function(value) {
					var msgText = "";
					if (!isNaN(value) && value >= 0 && value <= product.productQty) {
						return true;
					} else {
						if (value !== 0) {
							msgText = "Insufficient quantity in stock. Please enter quantity between 1 and " + product.productQty;
							return msgText.bold.red;
						}
					}
				}
			}
		]).then(function(answer) {
			var query =     "UPDATE products SET ? WHERE ?";
			var newQty = product.productQty - answer.qty;
			connection.query(query,
				[
					{
						stock_quantity: newQty
					},
					{
						item_id: product.idProduct
					}
				], function(err, res) {
					var msgText = "****************************************************************\n*\n";

					console.log(res.affectedRows + " products updated!\n");
					if (err) throw err;
					if (answer.qty > 0) {
						msgText += "*  You have purchased " + answer.qty + " " +
								product.productName + "(s).\n";
						msgText += "*  Purchase total: $" + (answer.qty * product.productPrice) + ".\n";
					} else {
						msgText += "* You decided to purchase 0 " + product.productName + "s. Continuing with bamazon...\n";
					}
					msgText += "*\n****************************************************************";
					console.log(msgText.bold.blue);
					startBamazon();
				}
			);			
		});
	}
 */
	/* 	function updateStartBid(bid, item) {
		console.log("Updating starting bid...\n");
		var query = connection.query(
			"UPDATE auctions SET ? WHERE ?",
			[
				{
					starting_bid: bid
				},
				{
					item_name: item
				}
			],
			function(err, res) {
				console.log("successfully purchased!\n");
				// console.log("You have purchased " + pro)
			// Call deleteProduct AFTER the UPDATE completes
			// deleteProduct();
			}
		);

		// logs the actual query being run
		console.log(query.sql);
	}

	function updateHighestBid(bid, item) {
		var query = connection.query(
			"UPDATE auctions SET ? WHERE ?",
			[
				{
					highest_bid: bid
				},
				{
					item_name: item
				}
			],
			function(err, res) {
				console.log(res.affectedRows + " item updated!\n");
				console.log("You are now the highest bidder!...\n");
				startBamazon();
			}
		);

		// logs the actual query being run
		console.log(query.sql);
	// startApp();
	}
 */
	// if (connectToDatabase()) {
	// start app
	//	startBamazon();
	// }
	var startBamazonMgr = connectToDatabase();

	startBamazonMgr();

})();