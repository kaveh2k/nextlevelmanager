`<!DOCTYPE html>
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
                    <img src="./logo.png" alt="Brand Logo">
                </div>
                <h2>Invoice for ${customer.name || 'In-shop Customer'}</h2>
                <p>Total Items: ${this.quantity}</p>
                <p>Issue Date: ${this.date} </p>
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
                        <td>${product.quantity}</td>
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
                    <!-- shop address  -->
                </address>
                </div>
            </div>
            </div>
        </body>
        </html>
`