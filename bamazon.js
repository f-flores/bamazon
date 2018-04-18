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
const PRICE_DECIMAL = 2;

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
		function beginApp() {
			startBamazon();
		}
		return beginApp;
	}

	var startBamazon = function () {
		inquirer.prompt([

			{
				type: "list",
				name: "userChoice",
				message: "Please choose one",
				choices: [ "DISPLAY ALL ITEMS", "EXIT BAMAZON"]
			}

		// After the prompt, store the user's response in a variable called location.
		]).then(function(answer) {
			switch(answer.userChoice) {
			case "DISPLAY ALL ITEMS":
				// console.log("You posted an item");
				displayItems();
				break;
			case "EXIT BAMAZON":
				console.log("Leaving bamazon... Please come back soon".green);
				connection.end();
				break;
			default:
				console.log("No valid option selected.");
				break;
			}
		});


		//		});
	};

	// ------------------------------------------------------------------------------------------
	// displayItems() shows all the items, including ids, names, and prices of products for sale
	//
	function displayItems() {
		var query;
	
		console.log("ITEM ID".padStart(PAD_ITEM_ID).bold.yellow +
			"   PRODUCT NAME  ".padStart(PAD_PRODUCT_NAME).bold.yellow + 
			"        PRICE  ".padStart(PAD_PRICE).bold.yellow );
		console.log("=======================================================".bold.blue);
		query = 
		connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
			for (const product of res) {
				console.log(product.item_id.toString().padStart(PAD_ITEM_ID) + " | " + 
				product.product_name.toUpperCase().padStart(PAD_PRODUCT_NAME) + " | " +
				product.price.toFixed(PRICE_DECIMAL).toString().replace(/^/,"$").padStart(PAD_PRICE)) ;
			}
			console.log("======================================================".bold.blue);
			getPurchaseOptions();
			// startBamazon();
		});
		// console.log(query.sql);
	}

	// ------------------------------------------------------------------------------------------
	// getPurchaseOptions() The first should ask them the ID of the product they would like to buy.
	// The second message should ask how many units of the product they would like to buy.
	//
	function getPurchaseOptions() {
		var purchaseItem = {
			idProduct: 0, 
			numProducts: 0,
			productName: "",
			productQty: 0
		};
				
		/* get total number of ids */
		function getNumProducts() {
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
			/* 			{
				type: "input",
				name: "unitsProduct",
				message: "How many units of the product you would like to buy?",
				validate: function(value) {
					var msgText = "";,

					if (value > 0 && value <= numProducts) {
						return true;
					} else {
						msgText = "Invalid input. Please enter valid product id. ";
						msgText += "Valid values between 1 and " + numProducts.toString();
						return msgText.bold.red;
					}
				}
			}  */
		]).then(function(data) {
			/* retrieves product name and stock quantity of current item id */
			function getProductName() {
				var query = "SELECT product_name, stock_quantity FROM products WHERE ?";
				connection.query(query, { item_id: data.idProduct }, function(err, res) {
					if (err) throw err;
					// console.log(res);
					// console.log(res[0].product_name);
					// console.log(res[0].stock_quantity);
					purchaseItem.idProduct = data.idProduct;
					purchaseItem.productName =  res[0].product_name;
					purchaseItem.productQty = res[0].stock_quantity;
					// console.log("purchaseItem: " + JSON.stringify(purchaseItem));
					promptPurchaseQty(purchaseItem);
				});
			}
			getProductName();

		});
	}

	// ------------------------------------------------------------------------------------------
	// promptPurchaseQty() asks the user how many were chosen and the quantity the user wishes
	//	to purchase of that item
	//
	function promptPurchaseQty(product) {
		console.log("Product chosen: " + JSON.stringify(product));

		inquirer.prompt([
			{
				type: "input",
				name: "qty",
				message: "How many " + product.productName + "(s) would you like to purchase?",
				validate: function(value) {
					if (!isNaN(value) && value > 0 && value <= product.productQty) {
						return true;
					} else {
							if (value !== 0) {
								return "Insufficient quantity in stock. Please enter quantity between 1 and " + product.productQty;
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
					// console.log("You chose" + answer.qty + ".");
					console.log(res.affectedRows + " products updated!\n");
					if (err) throw err;

					startBamazon();
				}
			);
			
		});
	}

	function updateStartBid(bid, item) {
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
				console.log(res.affectedRows + " item updated!\n");
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

	// if (connectToDatabase()) {
	// start app
	//	startBamazon();
	// }
	var startBamazonApp = connectToDatabase();

	startBamazonApp();

})();