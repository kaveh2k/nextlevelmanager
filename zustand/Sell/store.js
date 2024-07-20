import removeByAttr from '@/func/removeByAttr';
import { create } from 'zustand';

const useStoreSellProduct = create((set) => ({

    totalPriceForEachProduct: [],
    loadedPics: [],
    loadedPicsForInvoice: [],

    setTotalPriceForEachProduct: (id, tp, nQ) => {
        const tempArr = useStoreSellProduct.getState().totalPriceForEachProduct
        if (tempArr !== 0) {
            if (!tempArr.find(item => item.id === id)) {
                tempArr.push({ id: id, totalPrice: tp, amount: nQ })
            } else {
                tempArr.forEach(pr => {
                    if (pr.id == id) {
                        removeByAttr(tempArr, 'id', pr.id);
                        tempArr.push({ id: id, totalPrice: tp, amount: nQ })
                    }
                });
            }
        } else {
            tempArr.push({ id: id, totalPrice: tp, amount: nQ })
        }

        console.log("tempArr: ", tempArr);
        set({ totalPriceForEachProduct: tempArr });
    },

    setLoadedPicsForInvoice: (pics) => set({ loadedPicsForInvoice: [...useStoreSellProduct.getState().loadedPicsForInvoice, pics] }),
    setLoadPics: (pics) => set({ loadedPics: [...useStoreSellProduct.getState().loadedPics, pics] }),

    findProduct: async (id) => {
        const product = await window.api.findProduct(id)
        return product
    },
    loadPicture: async (path, stage) => {
        try {
            const dataURI = await window.api.loadPicture(path);
            if (stage == 1) useStoreSellProduct.getState().setLoadPics(dataURI);
            if (stage == 2) useStoreSellProduct.getState().setLoadedPicsForInvoice(dataURI);
        } catch (error) {
            console.error(error);
        }
    },
    clearLoadedPics: (stage) => {
        if (stage == 1) set({ loadedPics: [] })
        if (stage == 2) set({ loadedPicsForInvoice: [] })
    },

    deleteTotalPriceForEachProduct: (id) => {
        const tempArr = useStoreSellProduct.getState().totalPriceForEachProduct
        removeByAttr(tempArr, 'id', id);
        set({ totalPriceForEachProduct: tempArr })
    },


}))

export default useStoreSellProduct;