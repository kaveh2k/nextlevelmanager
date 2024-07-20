const { db } = require('../levelDB');

class Category {
    constructor({ name, subCategories = [], headingNum, headCategory, description }) {
        this.id = name; // Unique identifier for the category
        this.subCategories = subCategories; // Array of subcategory names
        this.description = description || "" // Description of the category
        this.headCategory = headCategory || ""
        this.headNum = headingNum // 0: no headCategory 1:first headCategory 2:second headCategory
    }

    static get keyPrefix() {
        return 'category:';
    }

    static key(name) {
        return `${this.keyPrefix}${name}`;
    }

    get key() {
        return Category.key(this.id);
    }

    // Save  the category
    save() {
        try {
            return new Promise((resolve, reject) => {

                db.get(this.key, (err, value) => {
                    if (!err || (err && err.type === 'NotFoundError')) {
                        // If not found or no error, proceed to save or update the category
                        const data = JSON.stringify(this);
                        db.put(this.key, data, err => {
                            if (err) reject(err);
                            else resolve(this);
                        });
                    } else {
                        // If there's an error other than 'NotFoundError', reject the promise
                        reject(err);
                    }
                });
            });
        } catch (error) {
            throw new Error("Error Class type Category, while saving ", error);
        }

    }

    // Find a category by name
    static find(name) {
        try {
            return new Promise((resolve, reject) => {
                db.get(this.key(name), (err, value) => {
                    if (err) {
                        if (err.type === 'NotFoundError') resolve(null);
                        else reject(err);
                    } else {
                        resolve(new Category({ ...JSON.parse(value), name }));
                    }
                });
            });
        } catch (error) {
            throw new Error("Error Class type Category, while finding ", error);
        }

    }

    // Delete a category
    static delete(name) {
        try {
            return new Promise((resolve, reject) => {
                db.del(this.key(name), err => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        } catch (error) {
            throw new Error("Error Class type Category, while deleting ", error);
        }

    }

    static async updateCategory(name, updates) {
        try {
            const category = await Category.find(name);
            if (!category) {
                throw new Error('Category not found');
            }
            if (updates.description) category.description = updates.description;
            if (updates.subCategories) category.subCategories = updates.subCategories;
            if (updates.headingNum == 0 || updates.headingNum) category.headNum = updates.headingNum; // 0 means false , so we have to include 0 to condition
            return category.save(); // This now correctly handles updates.
        } catch (error) {
            throw new Error("Error Class type Category, while updating Category ", error);
        }
    }

    // Remove a specific subcategory by name
    static async removeSubCategory(name, subCategoryName) {
        try {
            const category = await this.find(name);
            if (!category) throw new Error('Category not found');
            const updatedSubCategories = category.subCategories.filter(sub => sub !== subCategoryName);
            category.subCategories = updatedSubCategories;

            // Save the updated category
            return category.save();
        } catch (error) {
            throw new Error("Error Class type Category, while removing Sub Category ", error);
        }
    }

    static getAll() {
        try {
            return new Promise((resolve, reject) => {
                const categories = [];
                db.createReadStream()
                    .on('data', function (data) {
                        if (data.key.startsWith(Category.keyPrefix)) {
                            try {
                                const category = JSON.parse(data.value);
                                // Extracting the name from 'category:name'
                                category.id = data.key.split(':')[1];
                                categories.push(category);
                            } catch (err) {
                                reject(err);
                            }
                        }
                    })
                    .on('error', function (err) {
                        reject(err);
                    })
                    .on('end', function () {
                        resolve(categories);
                    });
            });
        } catch (error) {
            throw new Error("Error Class type Category, while getting All ", error);
        }
    }
}

module.exports = Category 