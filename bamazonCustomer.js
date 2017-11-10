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

        inquirer.prompt({
          name: "howMany",
          type: "input",
          message: "Excellent choice! How many would you like to purchase?"
        })
        .then(function(answer) {

          var inStock = false;

          for (var i = 0; i < results.length; i++) {
           if (answer.howMany <= results[i].stock_quantity) {

            inStock = true;

          }
        }

        if (inStock === true) {

          

        } else {

          console.log("Sorry, we don't have that many in stock!");

        }

      })

      } else {

        console.log("Oh no, looks like we don't have that! Please choose an item we have in stock.");
        startStore();

      }

    })

    });
  };