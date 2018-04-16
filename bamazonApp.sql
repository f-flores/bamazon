-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE auctions (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  starting_bid INT default 0,
  highest_bid INT default 0,
  PRIMARY KEY(ID)
);

-- INSERT INTO my_songs (title, artist, genre)
-- VALUE("Thriller", "Michael Jackson", "pop");

-- INSERT INTO my_songs (title, artist, genre)
-- VALUE("Mi Gente", "Hector Lavoe", "salsa");

-- INSERT INTO my_songs (title, artist, genre)
-- VALUES 
-- ("Aqui el que baila gana", "Los Van Van", "salsa"),
-- ("The Wall", "Pink Floyd", "rock"),
-- ("Hello", "Adele", "pop"),
-- ("The Sign", "Ace the Base", "pop");