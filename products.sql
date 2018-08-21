DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One S", "electronics", 300, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toilet Paper", "household essentials", 12, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Television", "electronics", 600, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Madden 2018", "electronics", 60, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wireless Headphones", "electronics", 160, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yeti Cooler", "outdoor living", 350, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grill", "outdoor living", 400, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawn Chair", "outdoor living", 35, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ziploc Bags", "household essentials", 5.50, 175);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Soccerball", "sports", 300, 15);

