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
console.log("\n" + "WELCOME TO BAMAZON!" + "\n");
connection.query("SELECT item_id, product_name, department_name, price FROM products ORDER BY department_name", function(err, res) {
    if (err) throw err;
    console.table(res);
    prompt();
});

function prompt() {
    inquirer
        .prompt([
            {
                name: "item_id",
                message: "Please enter the id of the item you would like to purchase."
            },
            {
                name: "units",
                message: "How many units would you like to purchase?"
            }
        ])
        .then(function(answer) {
            var id = answer.item_id;
            var units = answer.units;
            checkInventory(id, units);
        })
}

function checkInventory(id, units) {
    var sql = "SELECT * FROM products WHERE item_id = ?";
        connection.query(sql, id, function(err, res) {
            if(err) throw err;
            var res = res[0];
            if(units > res.stock_quantity) {
                console.log("Insufficient quantity! We currently have " + res.stock_quantity + " " + res.product_name + "'s in stock.");
                reAsk();
            }else {
                console.log("Total cost of order is $" + (units * res.price) +
                    "\n Thanks for shopping! Enjoy your purchase!");
                updateInventory(id, res.stock_quantity, units);
                updateProductSales(id, res.price, units);
                reAsk();
            }
        })
}

function updateInventory(id, stock, units) {
    var new_stock = stock - units;
    var sql = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    connection.query(sql, [new_stock, id], function(err) {
        if(err) throw err;
    })
}

function updateProductSales(id, price, units) {
    var total_purchase = price * units;

    connection.query("SELECT * FROM products WHERE item_id = ?", id, function(err, res) {
        if (err) throw err;
        var current_sales = parseFloat(res[0].product_sales);
        sumProductSales(id, current_sales);
    });

    function sumProductSales(id, current_sales) {
        var new_total_sales = total_purchase + current_sales;
        var sql = "UPDATE products SET product_sales = ? WHERE item_id = ?";
        connection.query(sql,[new_total_sales, id] , function(err) {
            if(err) throw err;
        })
    }
}

function reAsk() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to place another order?",
                name: "confirm",
                default: true
            }
        ])
        .then(function(answer) {
            if(answer.confirm) {
                prompt();
            }else {
                console.log("Thanks for shopping. Come again!");
                connection.end();
            }
        })
}