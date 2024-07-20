const levelup = require('levelup');
const leveldown = require('leveldown');
const encode = require('encoding-down');
const fs = require('fs');
require("dotenv").config();

// Declare 'db' with 'let' so it can be reassigned within openDatabase and other functions.
let db;
const dbAddress = process.env.DB_ADDRESS
// Function to initialize or reinitialize the 'db' variable
function initializeDB() {
    db = levelup(encode(leveldown(`${dbAddress}/db`), { valueEncoding: 'json' }));
}

// Initialize 'db' right away for initial use
initializeDB();

// manage open and close:
function openDatabase() {
    initializeDB(); // Reinitialize 'db' instead of direct assignment
}

function closeDatabase() {
    return new Promise((resolve, reject) => {
        if (db && !db.isClosed()) {
            db.close(err => {
                if (err) reject(err);
                else resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports = { openDatabase, closeDatabase, db };
