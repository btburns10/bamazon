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
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Product"],
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
                default: 
                console.log("not a command. please enter 'total', 'deposit', 'withdraw', 'lotto'");
            }
        })
}
prompt();


function displayAll() {
    console.log("it worked yesss!");
}
