const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Products
    addProduct: async (productData) => await ipcRenderer.invoke('add-product', productData),
    findProduct: async (barcode) => await ipcRenderer.invoke('find-product', barcode),
    updateProduct: async (barcode, updates) => await ipcRenderer.invoke('update-product', barcode, updates),
    deleteProduct: async (barcode) => await ipcRenderer.invoke('delete-product', barcode),
    getAllProducts: async () => await ipcRenderer.invoke('get-all-products'),
    isProductFolderExist: async (barcode) => await ipcRenderer.invoke('is-product-folder-exist', barcode),
    // Customers
    addCustomer: async (customerData) => ipcRenderer.invoke('add-customer', customerData),
    findCustomer: async (id) => ipcRenderer.invoke('find-customer', id),
    updateCustomer: async (id, updates) => ipcRenderer.invoke('update-customer', id, updates),
    deleteCustomer: async (id) => ipcRenderer.invoke('delete-customer', id),
    // Invoice
    createInvoice: (invoiceData) => ipcRenderer.invoke('create-invoice', invoiceData),
    findInvoice: (id) => ipcRenderer.invoke('find-invoice', id),
    updateInvoice: (id, updates) => ipcRenderer.invoke('update-invoice', id, updates),
    deleteInvoice: (id) => ipcRenderer.invoke('delete-invoice', id),
    // Backup
    createBackup: (backupPath) => ipcRenderer.invoke('create-backup', backupPath),
    onBackupProgress: (callback) => ipcRenderer.on('backup-progress', (_, progress) => callback(progress)),
    // TODO: setup backup restore 
    // Subscribe to backup progress updates
    // onBackupProgress: (callback) => {
    //     ipcRenderer.on('backup-progress', (event, progress) => {
    //         callback(progress);
    //     });
    // }
    // Category
    saveCategory: (categoryData) => ipcRenderer.invoke('save-category', categoryData),
    findCategory: (name) => ipcRenderer.invoke('find-category', name),
    deleteCategory: (name) => ipcRenderer.invoke('delete-category', name),
    updateCategory: (name, updates) => ipcRenderer.invoke('update-category', name, updates),
    removeSubCategory: (name, subCategoryName) => ipcRenderer.invoke('remove-subcategory', name, subCategoryName),
    getAllCategories: () => ipcRenderer.invoke('get-all-categories'),
    // Save image
    saveImage: (imageDataUrl, fileName, productFolder) => ipcRenderer.send('save-image', imageDataUrl, fileName, productFolder),
    deleteImage: (imagePath) => ipcRenderer.send('delete-image', imagePath),
    loadPicture: (imagePath) => ipcRenderer.invoke('load-product-image', imagePath),
    // settings
    saveSetting: (logo) => ipcRenderer.send('save-settings', logo),
});
