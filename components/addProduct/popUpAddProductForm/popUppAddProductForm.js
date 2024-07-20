import React, { useEffect } from 'react'
import { AiOutlineClose, } from 'react-icons/ai';
import CategoryDropDown from '../category/categoryDropDownMenu/categoryDropDown';
import UploadImage from '../category/image/uploadImage';
import useStoreUploadImage from '@/zustand/Uploadiamge/store';
import useStoreAddProduct from '@/zustand/Addproduct/store';


const PopUppAddProductForm = () => {
    const {
        setShowPopup,
        formDataProduct,
        setFormDataProduct,
        setSelectedCategoryId,
        isProductExist,
        isProductExistOnDatabase,
        isFolderExist,
        isInputEmpty,
        setIsDisable,
        isDisable,
        setIsInputEmpty,
        clearFormDataProduct,
    } = useStoreAddProduct()

    const {
        saveImageOnDataBase,
        clearImages
    } = useStoreUploadImage()

    const handleInputChange = (e) => {
        setFormDataProduct(e.target)
    };

    const handleSubmit = async (e) => {
        console.log("formDataProduct:", formDataProduct);
        e.preventDefault();
        await window.api.addProduct(formDataProduct)
            .then(data => {
                console.log('category created');
            }).catch(error => {
                alert(JSON.stringify(error));
                console.error('Creating category failed:', error);
            });
        // TODO: Reset state here if necessary
        setShowPopup(false);
        clearFormDataProduct()
        clearImages()
    };
    useEffect(() => {
        setIsDisable()
    }, [isFolderExist, isInputEmpty, isDisable, isProductExistOnDatabase])
    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-5 overflow-auto bg-white rounded-lg" style={{ maxHeight: '90vh' }}>
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Add New Product</h2>
                    <button onClick={() => setShowPopup(false)}>
                        <AiOutlineClose className="text-xl" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input name="barcode" placeholder="Barcode" className="w-full p-2 border rounded" onChange={(e) => {
                        if (e.target.value.length == 0) setIsInputEmpty(true)
                        if (e.target.value.length > 0) setIsInputEmpty(false)
                        isProductExist(e.target.value)
                        setIsDisable(e.target.value)
                        handleInputChange(e)
                    }} value={formDataProduct.barcode} required />

                    {isProductExistOnDatabase && <span className='text-rose-600 '>Product with "{formDataProduct.barcode}" is already exist.</span>}
                    {(isDisable && formDataProduct.barcode !== "") && <span className='text-rose-600'>A folder with this name is already exists.</span>}
                    {(formDataProduct.barcode == "") && <span className='text-rose-600'>Please write the product barcode first.</span>}

                    <input disabled={(isDisable || isProductExistOnDatabase)} name="name" placeholder="Name" className="w-full p-2 border rounded" onChange={handleInputChange} value={formDataProduct.name} required />
                    <input disabled={(isDisable || isProductExistOnDatabase)} name="availableQuantity" placeholder="Available Quantity" className="w-full p-2 border rounded" type="number" onChange={handleInputChange} value={formDataProduct.availableQuantity} required />
                    <input disabled={(isDisable || isProductExistOnDatabase)} name="sold" placeholder="Sold" className="w-full p-2 border rounded" type="number" onChange={handleInputChange} value={formDataProduct.sold} required />
                    <textarea disabled={(isDisable || isProductExistOnDatabase)} name="description" placeholder="Description" className="w-full p-2 border rounded" onChange={handleInputChange} value={formDataProduct.description} required />
                    <input disabled={(isDisable || isProductExistOnDatabase)} name="price" placeholder="Price" className="w-full p-2 border rounded" onChange={handleInputChange} value={formDataProduct.price} required />

                    <CategoryDropDown exist={(isDisable || isProductExistOnDatabase)} isRequired={true} onChangeSelect={(e) => {
                        setSelectedCategoryId(e.target.value)
                        handleInputChange(e)
                    }} isHeading={false} />

                    <UploadImage exist={(isDisable || isProductExistOnDatabase)} />

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            disabled={(isDisable || isProductExistOnDatabase)}
                            type="submit"
                            className={((isDisable || isProductExistOnDatabase) ? "px-4 py-2 text-gray-600 bg-gray-400 rounded hover:bg-gray-500 hover:text-gray-400" : "px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600")}
                            onClick={saveImageOnDataBase}
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default PopUppAddProductForm