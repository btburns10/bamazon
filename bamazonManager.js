const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

function prompt() {

    console.log("\n Welcome back to Bamazon! \n");

    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Remove Product"],
                name: "command"
            }
        ])
        .then(function(res) {
          
            switch(res.command) {
                case "View All Products":
                displayAll();
                break;
                case "View Low Inventory":
                displayLowInventory();
                break;
                case "Add to Inventory":
                addInventory();
                break;
                case "Add New Product":
                addNewProduct();
                break;
                case "Remove Product":
                removeProduct();
                break
            }
        })
}
prompt();

function promptAgain() {
    inquirer
        .prompt([
            {
                name: "command",
                type: "list",
                message: "What would you like to do next?",
                choices: ["Back to Menu", "Sign Out"]
            }
        ])
        .then(function(res) {
            if(res.command === "Back to Menu") {
                prompt();
            }else {
                console.log("See ya next time!");
                connection.end();
            }
        })
}

function displayAll() {
    connection.query("SELECT * FROM products ORDER BY department_name", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptAgain();
    });
}

function displayLowInventory() {
    var sql = "SELECT * FROM products WHERE stock_quantity <=5 ORDER BY department_name";
        connection.query(sql, function(err, res) {
            if (err) throw err;
            console.table(res);
            promptAgain();
    });
}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Enter the item id of the product you would like to add inventory to."
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter quantity"
            }
        ])
        .then(function(answer) {
            connection.query("SELECT * FROM products WHERE item_id = ?", answer.item, function(err, res) {
                if (err) throw err;
                var current_stock = parseFloat(res[0].stock_quantity);
                var product_name = res[0].product_name;
                updateInventory(current_stock, product_name);
            });
            //update inventory to reflect current inventory plus added quantity
            function updateInventory(stock, product) {
                var new_quantity = (stock + parseFloat(answer.quantity));
                connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                    [new_quantity, answer.item], 
                    function(err) {
                        if (err) throw err;
                        console.log("Success! " + answer.quantity + " " + product + "'s have been added to inventory.");
                        promptAgain();
                    });
            }
        })
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Enter name of product you would like to add."
            },
            {
                name: "department",
                type: "list",
                message: "Select the department of new product.",
                choices: ["electronics", "household essentials", "outdoor living", "sports"]
            },
            {
                name: "price",
                type: "input",
                message: "Enter the price per unit the product will sell for."
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter in quantity to add into inventory"
            }
        ])
        .then(function(input) {
            connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                [input.product, input.department, input.price, input.quantity],
                function(err) {
                    if(err) throw err;
                    console.log("Success! New product: " + input.product + ", has been added to Bamazon! \n");
                    promptAgain();
                }
            )
        })
}

function removeProduct() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Enter the item id of the product you would like to remove from inventory."
            }
        ])
        .then(function(answer) {
            connection.query("SELECT * FROM products WHERE item_id = ?", answer.item, function(err, res) {
                if (err) throw err;
                var product_name = res[0].product_name;
                deleteProduct(product_name);
            });
            function deleteProduct(product) {
                connection.query(
                    "DELETE FROM products where item_id = ?",
                    answer.item,
                    function(err) {
                        if(err) throw err;
                        console.log("Success! Product (" + product + ") has been removed from Bamazon.");
                        promptAgain();
                    }
                )
            }
        })
}
