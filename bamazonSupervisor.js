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
                name: "command",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department"]
            }
        ])
        .then(function(answer) {
            switch(answer.command) {
                case "View Product Sales by Department":
                displaySales();
                break;
                case "Create New Department":
                createNewDepartment();
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

function displaySales() {
    console.log("\n");
    connection.query(
        `SELECT departments.department_id, departments.department_name, departments.overhead_costs, 
         SUM(products.product_sales) AS product_sales,
         SUM(products.product_sales) - departments.overhead_costs AS total_sales
         FROM departments
         RIGHT JOIN products
         ON departments.department_name = products.department_name
         GROUP BY department_name
         ORDER BY department_id`,
        function(err, res) {
             if(err) throw err;
             console.table(res);
             promptAgain();
        }
    )
}

function createNewDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter name of department you would like to add."
            },
            {
                name: "overhead",
                type: "input",
                message: "Enter in dollars the amount of overhead cost this department will require."
            }
        ])
        .then(function(input) {
            connection.query(
                "INSERT INTO departments (department_name, overhead_costs) VALUES (?, ?)",
                [input.name, input.overhead],
                function(err) {
                    if(err) throw err;
                    console.log("Success! New department: " + input.name + ", has been added to Bamazon! \n");
                    promptAgain();
                }
            )
        })
}