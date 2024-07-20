// electron.js
const projectRoot = process.cwd();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const serve = require('electron-serve');
const { createBackup } = require('./levelDB/resorebackup');
const Product = require('./levelDB/schema/product');
const Invoice = require('./levelDB/schema/invoice');
const Customer = require('./levelDB/schema/customer');
const Category = require('./levelDB/schema/category');
const Settings = require('./levelDB/schema/settings');
const { getLogoAsBase64 } = require(`${projectRoot}/func/getLogoAsBase64`);
require('dotenv').config()


// Define a function to save an image to a specified path
// TODO: fid this function and see how it works and where it is?
const saveImage = (imageDataUrl, fileName, productPath) => {
    // Decode the data URL to get the image data
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    // Create the product folder if it doesn't exist
    const productFolderPath = path.join(__dirname, productPath);
    if (!fs.existsSync(productFolderPath)) {
        fs.mkdirSync(productFolderPath, { recursive: true });
    }
    // Construct the file path
    const filePath = path.join(productFolderPath, fileName);
    // Write the image data to the file
    fs.writeFileSync(filePath, buffer);
}

function readImageFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(`data:image/${filePath.split('.').pop()};base64,${data}`);
            }
        });
    });
};
const deleteImage = async (imagePath) => {
    const imageExist = fs.existsSync(imagePath)
    if (imageExist) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully!');
            }
        });
        return true;
    } else {
        throw new Error("Image does not exists.");
    }
}
const isProductFolderExist = (productBarcode) => {
    return fs.existsSync(`./DataBase/products/${productBarcode}/`);
}

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, '../out'),
}) : null;

let progress = 0; // Track progress
const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1080,
        height: 780,

        webPreferences: {
            preload: path.join(__dirname, './preload.js'), // Use the preload script
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: false,
        },
    });

    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL('app://-');
        });
    } else {
        win.loadFile("./components/loading/loading.html")
        win.once('ready-to-show', () => {
            const intervalId = setInterval(() => {
                progress += 5
                // Update progress bar and percentage dynamically
                if (progress >= 100) {
                    clearInterval(intervalId);
                    win.loadURL('http://localhost:3000');
                    win.webContents.openDevTools();
                }
            }, 140); // Adjust interval as needed
        });
        win.webContents.on('did-fail-load', (e, code, desc) => {
            win.webContents.reloadIgnoringCache();
        });
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Set up IPC handlers for LevelDB operations

// ******** Product IPC ********
ipcMain.handle('add-product', async (event, productData) => {
    try {
        const product = new Product(productData);
        return await product.create(); // Call the method to actually create the product
    } catch (error) {
        console.error('Failed to add product:', error);
        throw error; // Rethrow the error so the renderer process can handle it
    }
});
ipcMain.handle('find-product', async (event, barcode) => {
    try {
        const product = await Product.find(barcode);
        return ({ productExist: true, findProduct: product, productFirstImage: await getLogoAsBase64(`${product.imageFiles[0].imagePath}${product.imageFiles[0].pictureName}`), })
    } catch (error) {
        return ({ productExist: false, findProduct: error.message })
    }
});
ipcMain.handle('update-product', async (event, barcode, updates) => {
    try {
        const updatedProduct = await Product.update(barcode, updates);
        return updatedProduct;
    } catch (error) {
        console.error('Failed to update product:', error);
        throw error; // Rethrow the error so the renderer process can handle it
    }
});
ipcMain.handle('delete-product', async (event, barcode) => {
    try {
        await Product.delete(barcode);
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        console.error('Failed to delete product:', error);
        throw error; // Rethrow the error so the renderer process can handle it
    }
});
ipcMain.handle('get-all-products', async (event) => {
    try {
        const products = await Product.getAll();;
        return (products)
    } catch (error) {
        console.error('Failed to get products:', error);
        throw error;
    }
})
ipcMain.handle('is-product-folder-exist', async (event, barcode) => {
    try {
        const isExist = await isProductFolderExist(barcode)
        return isExist
    } catch (error) {
        console.error('Failed to check product exist:', error);
        throw error;
    }
})
// ******** Customer IPC *********
ipcMain.handle('add-customer', async (event, customerData) => {
    // Handle creating a new customer
    try {
        const customer = new Customer(customerData);
        await customer.save();
        // return customer; // Return the saved customer
    } catch (error) {
        console.error('Failed to add customer:', error);
        throw error;
    }
});
ipcMain.handle('find-customer', async (event, id) => {
    // Handle finding a customer
    try {
        const customer = await Customer.find(id);
        return customer;
    } catch (error) {
        console.error('Failed to find customer:', error);
        throw error;
    }
});
ipcMain.handle('update-customer', async (event, id, updates) => {
    // Handle updating a customer
    try {
        const updatedCustomer = await Customer.update(id, updates);
        return updatedCustomer;
    } catch (error) {
        console.error('Failed to update customer:', error);
        throw error;
    }
});
ipcMain.handle('delete-customer', async (event, id) => {
    // Handle deleting a customer
    try {
        await Customer.delete(id);
        return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
        console.error('Failed to delete customer:', error);
        throw error;
    }
});

// ******** Invoice IPC ********
ipcMain.handle('create-invoice', async (event, invoiceData) => {
    // Handle creating a new invoice
    try {
        const invoice = new Invoice(invoiceData);
        await invoice.generatePDF();
        await invoice.save();
        return invoice;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
});
ipcMain.handle('find-invoice', async (event, id) => {
    // Handle finding an invoice
    try {
        return await Invoice.find(id);
    } catch (error) {
        console.error('Error finding invoice:', error);
        throw error;
    }
});
ipcMain.handle('update-invoice', async (event, id, updates) => {
    // Handle updating an invoice
    try {
        return await Invoice.update(id, updates);
    } catch (error) {
        console.error('Error updating invoice:', error);
        throw error;
    }
});
ipcMain.handle('delete-invoice', async (event, id) => {
    // Handle deleting an invoice
    try {
        await Invoice.delete(id);
        return { success: true, message: 'Invoice deleted successfully' };
    } catch (error) {
        console.error('Error deleting invoice:', error);
        throw error;
    }
});

// ******** Category IPC ********
ipcMain.handle('save-category', async (event, categoryData) => {
    // Handler for creating a category
    try {
        const category = new Category(categoryData);
        await category.save();
        return { success: true, message: 'Category saved successfully', category: categoryData };
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
});
ipcMain.handle('find-category', async (event, name) => {
    // Handler for finding a category
    return await Category.find(name);
});
ipcMain.handle('delete-category', async (event, name) => {
    // Handler for deleting a category
    await Category.delete(name);
    return { success: true, message: 'Category deleted successfully' };
});
ipcMain.handle('remove-subcategory', async (event, name, subCategoryName) => {
    // Handler for removing a specific subcategory
    await Category.removeSubCategory(name, subCategoryName);
    return { success: true, message: 'Subcategory removed successfully' };
});
ipcMain.handle('update-category', async (event, name, updates) => {
    // update
    try {
        const updatedCategory = await Category.updateCategory(name, updates);
        return { success: true, updatedCategory, message: 'Category updated successfully' };
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
});
ipcMain.handle('get-all-categories', async (event) => {
    try {
        const categories = await Category.getAll();
        return categories;
    } catch (error) {
        console.error('Failed to get categories:', error);
        throw error;
    }
});

// ******** Create BackUp DataBase ***********
ipcMain.handle('create-backup', async (event, backupPath) => {
    try {
        // Optionally, you could allow the renderer to specify a backup path
        const path = await createBackup((progress) => {
            // This is where you'd handle progress updates if needed
            event.sender.send('backup-progress', progress);
        }, backupPath);
        return path;
    } catch (error) {
        console.error('Backup failed:', error);
        throw error;
    }
});

// ******** Save/Delete Image ***********
ipcMain.on('save-image', (event, imageDataUrl, fileName, productFolder) => {
    saveImage(imageDataUrl, fileName, productFolder);
});
ipcMain.on('delete-image', (event, imagePath) => {
    deleteImage(imagePath)
});
ipcMain.handle('load-product-image', async (event, imagePath) => {
    try {
        const dataURI = await readImageFromFile(path.join(__dirname, '../DataBase/products/', imagePath));
        return dataURI;
    } catch (error) {
        console.error('Error loading image:', error);
        throw error; // Re-throw error for handling in the renderer process
    }
});

// ******** Save/Delete settings ***********
ipcMain.on('save-settings', (event, data) => {
    try {
        const settings = new Settings(data)
        settings.create();
        return { success: true, message: 'Settings saved successfully', };
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
});

ipcMain.on('get-logo', (event, logo) => {
    try {
        const settings = new Settings()
        settings.getShopLogo()
    } catch (error) {

    }
})
