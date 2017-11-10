  var mysql = require("mysql");
  var inquirer = require("inquirer");
  require("dotenv").config();

  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;

    displayProducts();
  });

  function displayProducts() {
    connection.query("SELECT * FROM products", function(err, results) {

      console.log("Welcome to Bamazon!");
      console.log("-------------------------------------------");
      console.log("Today's Products:")

      for (var i = 0; i < results.length; i++) {
        console.log(`PRODUCT ID: ${ results[i].item_id} \t ITEM NAME: ${ results[i].product_name } \t PRICE: $${ results[i].price }`)
      }

      console.log("-------------------------------------------");
      startStore();

    })
  };

  function startStore() {
    inquirer
    .prompt({
      name: "chooseItem",
      type: "input",
      message: "Please provide the product ID for the item you would like to buy."
    })
    .then(function(answer) {

      connection.query("SELECT * FROM products", function(err, results) {

        var isProduct = false;

        for (var i = 0; i < results.length; i++) {
         if (answer.chooseItem == results[i].item_id) {
          isProduct = true;
        }
      }

      if (isProduct === true) {

        console.log("you can buy this product");

      } else {

        console.log("Oh no, we don't carry that product! Please choose an item we have in stock.");
        startStore();

      }

    })

    });
  };