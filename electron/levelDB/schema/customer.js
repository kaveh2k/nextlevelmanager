const { db } = require('../levelDB');

class Customer {
    constructor({ name, email, phone, purchases }) {
        this.id = phone;
        this.name = name;
        this.email = email;
        this.purchases = purchases || [null]; // Array of invoice IDs
    }
    static get keyPrefix() {
        return 'customer:';
    }

    static key(id) {
        return `${Customer.keyPrefix}${id}`;
    }

    get key() {
        return Customer.key(this.id);
    }

    save() {
        return new Promise((resolve, reject) => {
            Customer.find(this.id).then(customer => {
                if (!customer) {
                    db.put(this.key, JSON.stringify(this), (err) => {
                        if (err) reject(err);
                        else resolve(this);
                    });
                    // console.log("this is customer:" + customer);
                } else {
                    // console.log('Customer already exists with this ID');
                    resolve(customer)
                }
            }).catch((er) => {
                console.log(er);
            });
        });
    }

    static async find(id) {
        return new Promise((resolve, reject) => {
            db.get(this.key, (err, value) => {
                if (err) {
                    if (err.type === 'NotFoundError') {
                        // If customer not found, resolve with false
                        resolve(false);
                    } else {
                        reject(err); // For other errors, reject the promise
                    }
                } else {
                    resolve(true); // Resolve with true if found
                }
            });
        });
    }

    static update(id, updates) {
        return this.find(id).then(customer => {
            Object.assign(customer, updates);
            return new Promise((resolve, reject) => {
                db.put(this.key, customer, (err) => {
                    if (err) reject(err);
                    else resolve(customer);
                });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.del(this.key, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = Customer;
