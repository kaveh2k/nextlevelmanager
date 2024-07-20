import { create } from 'zustand';
import useStoreAddProduct from '../Addproduct/store';

const useStoreUploadImage = create((set) => ({
    images: [],
    logo: [],
    uploadProgress: {},
    updateImage: [],

    setImages: (img) => { set((state) => ({ images: [...state.images, img] })) },
    setUploadProgress: (nImg) => { set((state) => ({ uploadProgress: { ...state.uploadProgress, [nImg.id]: 100 } })) },
    setUpdateImage: (image) => set((state) => ({ updateImage: image })),


    clearImages: () => { set({ images: [] }) },


    removeImageById: async (id, path) => {
        await set((state) => ({ images: useStoreUploadImage.getState().images.filter((image) => image.id !== id) }))
        await set((state) => ({ updateImage: useStoreUploadImage.getState().updateImage.filter((image) => image.imageId !== id) }))
        useStoreAddProduct.getState().deleteProduct()
    },

    saveImageOnDataBase: () => {
        useStoreUploadImage.getState().updateImage.map(async (img) => {
            useStoreUploadImage.getState().images.map(async (nImg) => {
                if (nImg.id == img.imageId) {
                    const productPath = `../DataBase/Settings/${img.productFolderName}/images/` // address calculate from main.js file
                    await window.api.saveImage(nImg.src, img.pictureName, productPath);
                }
            })
        })
    },

    handleImageChange: async (e) => {
        const files = Array.from(e.target.files);
        const updateImage = []
        // Save the image with a predefined name
        const productName = useStoreAddProduct.getState().formDataProduct.barcode;
        await files.forEach(async (file, index) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newImage = { id: `image-${index}`, src: e.target.result, name: file.name, size: file.size };
                useStoreUploadImage.getState().setImages(newImage)
                // Simulate upload progress (change to your actual upload logic)
                setTimeout(() => {
                    set((state) => ({ uploadProgress: { ...state.uploadProgress, [newImage.id]: 100 } }));
                }, 1000);
                // Replace with your product name
                const fileName = `${productName}-${newImage.id}.${file.name.split('.').pop()}`;
                // Logic to save the image to the specified path
                updateImage.push({ imagePath: `./DataBase/products/${productName}/images/`, imageId: newImage.id, productFolderName: productName, pictureName: fileName, })
            };
            reader.readAsDataURL(file);
        });
        useStoreUploadImage.getState().setUpdateImage(updateImage);
        useStoreAddProduct.getState().addImageFiles(updateImage);
    },
}))

export default useStoreUploadImage;