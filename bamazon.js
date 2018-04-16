/* bamazon.js */

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "dbuser",

	// Your password
	password: "",
	database: "bamazon_db"
});



// Prompt the user to provide location information.
function startApp() {
	inquirer.prompt([

		{
			type: "list",
			name: "userInput",
			message: "Please choose one",
			choices: [ "POST AN ITEM", "BID ON AN ITEM", "EXIT APP" ]
		}

		// After the prompt, store the user's response in a variable called location.
	]).then(function(user) {
		connection.connect(function(err) {
			if (err) throw err;
			console.log("connected as id " + connection.threadId + "\n");
			switch(user.userInput){
			case "POST AN ITEM":
				console.log("You posted an item");
				addItem();
				// startApp();
				// connection.end();
				break;
			case "BID ON AN ITEM":
				console.log("You bid on item");
				bid();
				// startApp();
				break;
			case "EXIT APP":
				console.log("Leaving application ...");
				connection.end();
				break;
			default:
				console.log("nothing");
				break;
			}
		});


	});
}


function addItem() {
	inquirer.prompt([
		{
			type: "input",
			name: "itemName",
			message: "What item are you selling?"
		},
		{
			type: "input",
			name: "itemCategory",
			message: "What category?"
		}
	]).then(function(data) {
		console.log("adding item to auctions database");
		var query = connection.query(
			"INSERT INTO auctions SET ?",
			{
				item_name: data.itemName,
				category: data.itemCategory
			},
			function(err, res) {
				console.log(res.affectedRows + "Item added successfully!\n");
				startApp();
			}
		);
		console.log(query.sql);
	});
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
				startApp();
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
			startApp();
		}
	);

	// logs the actual query being run
	console.log(query.sql);
	// startApp();
}

// start app
startApp();