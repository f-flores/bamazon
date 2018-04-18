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
			if (err) {
				throw err;
			}
		//	console.log("connected as id " + connection.threadId + "\n");
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
			startBamazon();
		});
		// console.log(query.sql);
	}

	function bid() {
		console.log("selecting all items");
		connection.query("SELECT item_name, category FROM auctions", function(err, res) {
			if (err) throw err;

			function getChoices() {
				var choices = [];
				for (const item of res) {
					choices.push(item.item_name);
				}

				return choices;
			}

			inquirer.prompt([
				{
					type: "list",
					name: "bidChoice",
					message: "Please choose one",
					choices: getChoices()
				} 
			]).then(function(data) {
				console.log("You picked " + data.bidChoice);
				// How much they would like to bid...
				getBid(data.bidChoice);
			}
			);
		});
	}

	function getBid(itemChosen) {
		console.log("Item chosen: " + itemChosen);
		inquirer.prompt([
			{
				type: "input",
				name: "bidPrice",
				message: "How much are you bidding on " + itemChosen + "?",
				validate: function(value) {
					var price = parseFloat(value);
					if (!isNaN(price) && price > 0) {
						return true;
					} else {
						return "Invalid input. Please enter bidding price greater than 0.";
					}
				}
			}
		]).then(function(answer) {
			var query, qStatement = "SELECT starting_bid, highest_bid FROM auctions WHERE item_name = " + connection.escape(itemChosen) + ";";
			console.log("You bid $" + answer.bidPrice + ".");
			query = connection.query(qStatement, function(err, res) {
				if (err) throw err;

				if (res[0].starting_bid === 0) {
				// update starting_bid to answer.bidPrice
					updateStartBid(answer.bidPrice, itemChosen);
				}
				if (answer.bidPrice > res[0].highest_bid) {
				// update highest_bid to answer.bidPrice
					updateHighestBid(answer.bidPrice, itemChosen);
				} else {
					console.log("Sorry, your bid is to low. Please try again.");
					startBamazon();
				}
			}
			);
			// startApp();
			console.log(query.sql);
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