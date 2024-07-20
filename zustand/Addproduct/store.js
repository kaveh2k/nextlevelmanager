import { create } from 'zustand';

const useStoreAddProduct = create((set) => ({
    fetchCategories: null,
    fetchProducts: null,
    setShowPopup: null,
    showPopup: null,
    allProduct: null,
    showPopup: false,
    allProduct: [],
    selectedCategoryId: null,
    subCategoryName: '',
    newCategory: "",
    headingCategory: '',
    categories: [],
    headingCategoryNum: 0,
    isCategoryPopupOpen: false,
    formDataProduct: {
        barcode: '',
        name: '',
        availableQuantity: '',
        sold: '',
        description: '',
        price: '',
        category: '',
        imageFiles: [],
    },
    isFolderExist: false,
    isProductExistOnDatabase: false,
    isInputEmpty: true,
    isDisable: true,

    clearFormDataProduct: () => {
        set({
            formDataProduct: {
                barcode: '',
                name: '',
                availableQuantity: '',
                sold: '',
                description: '',
                price: '',
                category: '',
                imageFiles: [],
            }
        })
    },

    isProductExist: async (productName) => {
        const productCheck = await window.api.findProduct(productName)
        const folderExist = await window.api.isProductFolderExist(productName);
        useStoreAddProduct.getState().setFolderExist(folderExist)
        return useStoreAddProduct.getState().setIsProductExistOnDatabase((folderExist || productCheck.productExist))
    },

    setIsDisable: (barcode) => set({ isDisable: (useStore.getState().isFolderExist || useStore.getState().isInputEmpty) }),
    setIsInputEmpty: (value) => set({ isInputEmpty: value }),
    setFormDataProduct: (data) => { set((state) => ({ formDataProduct: { ...state.formDataProduct, [data.name]: data.value } })) },
    setFolderExist: (bool) => set({ isFolderExist: bool }),
    setIsProductExistOnDatabase: (exist) => { set({ isProductExistOnDatabase: exist }) },
    setCategories: (categories) => { set({ categories: categories }) },
    setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
    setShowPopup: (SP) => set({ showPopup: SP }),
    setAllProduct: (products) => set({ allProduct: products }),
    setSubCategoryName: (name) => { set({ subCategoryName: name }) },
    setNewCategory: (newCat) => { set({ newCategory: newCat }) },
    setHeadingCategory: (category) => { set({ headingCategory: category }) },
    setCategories: (categories) => { set({ categories: categories }) },
    setHeadingCategoryNum: (num) => { set({ headingCategoryNum: num }) },
    setIsCategoryPopupOpen: (isOpen) => { set({ isCategoryPopupOpen: isOpen }) },

    addImageFiles: (newImageFiles) => {
        set((state) => ({
            formDataProduct: {
                ...useStoreAddProduct.getState().formDataProduct,
                imageFiles: newImageFiles, // Spread both arrays
            },
        }));
    },
    deleteProduct: async () => {
        set((state) => ({
            formDataProduct: {
                ...useStoreAddProduct.getState().formDataProduct,
                imageFiles: useStoreAddProduct.getState().updateImage
            }
        }))
    },
    addCategory: async (hN) => {
        try {
            await window.api.saveCategory({ name: useStoreAddProduct.getState().newCategory, subCategories: [], headingNum: hN, headCategory: useStoreAddProduct.getState().headingCategory, description: "No Category Description" })
            await useStoreAddProduct.getState().fetchCategories(); // Refresh the category list
            await useStoreAddProduct.getState().setSubCategoryName(''); // Reset input
        } catch (error) {
            throw new Error("Error while creating category, ", error);
        }
    },

    removeSubCategory: async (categoryId, subCategoryName) => {
        try {
            await window.api.removeSubCategory(categoryId, subCategoryName);
            await useStoreAddProduct.getState().fetchCategories();
        } catch (error) {
            throw new Error("Error while removing  Sub Category, ", error);
        }

    },

    deleteCategory: async (name) => {
        try {
            useStoreAddProduct.getState().categories.map(async (category) => { // delete sub categories related to the given category
                if (category.id == name) {
                    category.subCategories.map(async (id) => {
                        await window.api.deleteCategory(id);
                    })
                    // await window.api.deleteCategory(id);
                }
            })
            await window.api.deleteCategory(name);
            await useStoreAddProduct.getState().fetchCategories();
        } catch (error) {
            throw new Error("Error while deleting Category ", error);
        }

    },

    fetchCategories: async () => {
        try {
            const fetchedCategories = await window.api.getAllCategories();
            await useStoreAddProduct.getState().setCategories(fetchedCategories || []);
        } catch (error) {
            throw new Error("Error while fetching Categories ", error);
        }
    },
    fetchProducts: async () => {
        try {
            const fetchedProducts = await window.api.getAllProducts();
            await useStoreAddProduct.getState().setAllProduct(fetchedProducts || []);
        } catch (error) {
            throw new Error("Error while fetching Products ", error);
        }
    },
    addSubCategory: async () => {
        try {
            if (useStoreAddProduct.getState().selectedCategoryId && useStoreAddProduct.getState().subCategoryName.trim()) {
                const categoryToUpdate = useStoreAddProduct.getState().categories.find(c => c.id === useStoreAddProduct.getState().selectedCategoryId); // if the selected category exist
                if (categoryToUpdate) {
                    const updatedSubCategories = [...categoryToUpdate.subCategories, useStoreAddProduct.getState().subCategoryName]; // add the sub category to the rest of sub categories of the given category
                    updatedSubCategories.map(async (sub) => { // create a category in main category of the resent sub category added 
                        if (!useStoreAddProduct.getState().categories.find(e => e.id === sub)) { // if it is not already added
                            await window.api.saveCategory({ name: sub, subCategories: [], headingNum: useStoreAddProduct.getState().headingCategoryNum, headCategory: useStoreAddProduct.getState().headingCategory, description: "No Sub Category Description" })
                        }
                    })
                    const heading = (useStoreAddProduct.getState().headingCategoryNum - 1) // change the level to one upper (because it has changed when adding sub-category into the main categories)
                    await window.api.updateCategory(useStoreAddProduct.getState().selectedCategoryId, { subCategories: updatedSubCategories, headingNum: heading }); // update the category
                    await useStoreAddProduct.getState().fetchCategories(); // Refresh the category list
                    await useStoreAddProduct.getState().setSubCategoryName(''); // Reset input
                    await useStoreAddProduct.getState().setHeadingCategoryNum(0)
                }
            }
        } catch (error) {
            throw new Error("Error while adding Sub Category, ", error);
        }

    },
}))

export default useStoreAddProduct;