# bamazon

bamazon is a command line application which uses nodejs. It is an amazon-like store front. The app leverages MySQL to keep track of purchase orders and inventory and produces reports for would be managers and supervisors of this virtual store.

The `bamazon_db` database consists of two tables, `products` and  `departments`. The ``products table has the following columns:

* item_id (unique id for each product)

* product_name (Name of product)

* dept_id (id of product's department - Note that this field references the `departments` table)

* price (cost to customer)

* stock_quantity (how much of the product is available in stores)

The `departments` table includes the following:

* department_id (unique id for each department)

* department_name (name of the department)

* overhead_costs (cost to install and run department)

## Usage

`node ./bamazonCustomer.js`

The bamazon customer module will display all of the items available for sale. The id, product names and prices are displayed. The user is then presented with two messages.

1. The first asks for the ID of the product to be purchased.

2. The second message asks how many units of the product the user would like to purchase.

![alt text](./assets/images/bamazonCustomer.gif "bamazonCustomer Module Flow")

`node ./bamazonManager.js` -

`node ./bamazonSupervisor.js` - lists and executes a pair of actions available to store supervisors, "View Product Sales by Department" and "Create Department".

## Description

This terminal based app

## Installation

This app can be cloned using git.

However, in order to successfully run this app, a few programs must be already installed as prerequisites.

1. git must be installed.
  [Download git.](https://git-scm.com/downloads)

2. nodejs must also be installed.
  [Download nodejs](https://nodejs.org/en/download/)

3. Now we are ready to clone this app by running the following command. `git clone git@github.com:f-flores/bamazon.git`

4. Since this file makes use of a couple of node modules (`mysql`, `inquirer`, `table` and `colors`) please run `npm install`.  This installs all of the dependencies.

## Comments

The ConstructorHangman app was added to my github portfolio:
[bamazon](https://github.com/f-flores/bamazon)