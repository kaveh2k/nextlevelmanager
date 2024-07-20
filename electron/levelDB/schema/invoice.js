const projectRoot = process.cwd();
const { getLogoAsBase64 } = require(`${projectRoot}/func/getLogoAsBase64`);
const { db } = require('../levelDB');
const Customer = require("./customer")
const Product = require('./product');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer');
require("dotenv").config()

class Invoice {
    constructor({ customerId, productIds, total, quantity, today = new Date() }) {
        this.today = today;
        this.formattedDate = this.today.toLocaleDateString('en-GB');
        this.date = this.formattedDate
        this.customerId = customerId || "in-shop";
        this.refNum = `DG-${Date.now()}-${customerId}`
        this.id = this.refNum;
        this.productIds = productIds; // Array of products IDS
        this.total = total;
        this.quantity = quantity || 0;
    }

    static get keyPrefix() {
        return 'invoice:';
    }

    static key(id) {
        return `${this.keyPrefix}${id}`;
    }

    get key() {
        return Invoice.key(this.id);
    }

    async save() {
        // this.generatePDF(this.customerId, this.productIds, this.quantity, this.date, this.refNum, this.total, this.id)
        return await new Promise((resolve, reject) => {
            db.put(this.key, this, (err) => {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }
    static find(id) {
        return new Promise((resolve, reject) => {
            db.get(Invoice.key(id), async (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const invoiceData = JSON.parse(value);
                        const customer = await Customer.find(invoiceData.customerId);
                        const products = await Promise.all(invoiceData.productIds.map(pid => Product.find(pid)));
                        resolve({ ...invoiceData, customer, products });
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }
    static update(id, updates) {
        return new Promise((resolve, reject) => {
            this.find(id).then(invoice => {
                Object.assign(invoice, updates);
                db.put(Invoice.key(id), invoice, (err) => {
                    if (err) reject(err);
                    else resolve(invoice);
                });
            }).catch(reject);
        });
    }
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.del(Invoice.key(id), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static getFormattedDate() {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        const formattedDate = dd + '-' + mm + '-' + yyyy;
        return formattedDate;
    }

    async generatePDF() {
        // console.log("this is product ids:" + this.productIds);
        // async function getLogoAsBase64(address) {
        //     const projectRoot = process.cwd();
        //     const imagePath = path.join(projectRoot, address);
        //     const imageData = await fs.promises.readFile(imagePath, 'base64');
        //     return `data:image/png;base64,${imageData}`;
        // }
        const shopAddress = process.env.SHOP_ADDRESS
        // TODO: fix customer data and name
        // const customer = null//await Customer.find(this.customerId);
        const products = await Promise.all(this.productIds.map(pid => Product.find(pid.id)));
        const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
                body {
                    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    color: #555;
                }
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                    font-size: 16px;
                    line-height: 24px;
                }
                .invoice-box table {
                    width: 100%;
                    line-height: inherit;
                    text-align: left;
                    border-collapse: collapse; /* Ensure divider lines are displayed */
                }
                .invoice-box table td, .invoice-box table th {
                    padding: 10px;
                    border: 1px solid #ddd; /* Divider lines */
                }
                .invoice-box table tr.heading th {
                    background: #eee;
                    font-weight: bold;
                }
                .invoice-box table tr.item td{
                    border-bottom: 1px solid #eee;
                }
                .logo {
                    width: 100%;
                    text-align: right;
                    padding-bottom: 20px;
                }
                .logo img {
                    max-width: 200px; /* Adjust based on your logo size */
                }
                .product-img img {
                    max-height: 50px; /* Adjust size as needed */
                    width: auto;
                }
                .total {
                    font-family: Arial, sans-serif;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="logo">
                    <img src="${await getLogoAsBase64(process.env.INVOICE_LOGO)}" alt="Brand Logo">
                </div>
                <h2>Invoice for ${'In-shop Customer'}</h2>
                <p>Total Items: ${this.quantity}</p>
                <p>Issue Date: ${new Date().toLocaleDateString('en-GB')} </p>
                <p>Reference Number: ${this.refNum} </p>
                <p>Total Price: $${Number(this.total).toFixed(2)}</p>
                <table>
                    <tr class="heading">
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${products.map(product => `
                    <tr class="item">
                        <td>${product.name}</td>
                        <td>${this.productIds.find(pr => pr.id === product.barcode).quantity}</td>
                        <td>$${product.price}</td>
                    </tr>
                    `).join('')}
                    <tr class="total">
                        <td></td>
                        <td></td>
                        <td>Total: $${Number(this.total).toFixed(2)}</td>
                    </tr>
                </table>
                <div class="address">
                <p>Company Address: </p>
                <address>
                    ${shopAddress}
                </address>
                </div>
            </div>
            </div>
        </body>
        </html>
        
    `;
        // Ensure the invoices directory exists
        const invoicesDir = path.join(__dirname, `../../../DataBase/Invoices/${Invoice.getFormattedDate()}`);
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const filePath = path.join(invoicesDir, `invoice_${this.id}.pdf`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Use HTML content here, adjusted as necessary for this specific invoice
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({ path: filePath, format: 'A4' });

        await browser.close();
        //return filePath; // Return the path where the PDF was saved
    }
}
module.exports = Invoice