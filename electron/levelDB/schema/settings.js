// Product.js
const projectRoot = process.cwd();
const { getLogoAsBase64 } = require(`${projectRoot}/func/getLogoAsBase64`);
const { db } = require('../levelDB');
const fs = require('fs');
const path = require('path')

class Settings {
    constructor({ shopLogo, shopName, theme }) {
        this.shopLogo = shopLogo;
        this.shopName = shopName || 'please-change-shop-name';
        this.theme = theme || 'default';
    }


    static get keyPrefix() {
        return 'setting:';
    }

    static key(id) {
        return `setting:${id}`;
    }

    get key() {
        return `${Product.keyPrefix}${this.shopName}`;
    }

    async create() {
        console.log("creating settings: ", this);
        try {
            return new Promise((resolve, reject) => {
                db.put(this.key, this, (err) => {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
        } catch (error) {
            throw error
        }
    }
    // TODO: update all methods 
    static async find(barcode) {
        return new Promise((resolve, reject) => {
            db.get(Product.key(barcode), (err, value) => {
                if (err) reject(err);
                else resolve(new Product(value));
            });
        });
    }

    static update(barcode, updates) {
        return Product.get(barcode).then(product => {
            Object.assign(product, updates);
            return new Promise((resolve, reject) => {
                db.put(Product.key(product.barcode), product, (err) => {
                    if (err) reject(err);
                    else resolve(product);
                });
            });
        });
    }

    static delete(barcode) {
        return new Promise((resolve, reject) => {
            db.del(Product.key(barcode), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static getAll() {
        try {
            return new Promise((resolve, reject) => {
                const products = [];
                db.createReadStream()
                    .on('data', async function (data) {
                        if (data.key.startsWith(Settings.keyPrefix)) {
                            try {
                                const setting = data.value
                                setting.id = data.key.split(':')[1]; // Extracting the name from 'product:name'    
                                products.push(product);
                            } catch (err) {
                                reject(err);
                            }
                        }
                    })
                    .on('error', function (err) {
                        reject(err);
                    })
                    .on('end', function () {
                        resolve(products);
                    });
            });
        } catch (error) {
            throw new Error("Error Class type Category, while getting All ", error);
        }
    }
}

module.exports = Settings;
