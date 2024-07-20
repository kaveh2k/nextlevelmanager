// Product.js
const projectRoot = process.cwd();
const { getLogoAsBase64 } = require(`${projectRoot}/func/getLogoAsBase64`);
const { db } = require('../levelDB');
const fs = require('fs');
const path = require('path')

class Product {
    constructor({ barcode, name, availableQuantity, sold, imageFiles, description, price, category, }) {
        this.barcode = barcode;
        this.id = barcode
        this.name = name;
        this.availableQuantity = availableQuantity || 1;
        this.sold = sold || 0;
        this.imageFiles = imageFiles || []; // array
        this.description = description || "No Description";
        this.price = price || "0.00";
        this.category = category;
        this.picData
        // this.trackingNumbers = trackingNumbers; // arrays
    }


    static get keyPrefix() {
        return 'product:';
    }

    static key(id) {
        return `product:${id}`;
    }

    get key() {
        return `${Product.keyPrefix}${this.id}`;
    }

    async create() {
        console.log("creating product: ", this);
        this.picData = await getLogoAsBase64(`${this.imageFiles[0].imagePath}${this.imageFiles[0].pictureName}`);
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
                        if (data.key.startsWith(Product.keyPrefix)) {
                            try {
                                const product = data.value
                                product.id = data.key.split(':')[1]; // Extracting the name from 'product:name'    
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

module.exports = Product;
