"use client"
import { useEffect } from 'react';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';

import Image from 'next/image';
import CategoryManagement from '@/components/addProduct/category/categoryManagement';
import PopUppAddProductForm from '@/components/addProduct/popUpAddProductForm/popUppAddProductForm';
import useStoreAddProduct from '@/zustand/Addproduct/store';



const AddProductPage = () => {
    const {
        fetchCategories,
        fetchProducts,
        setShowPopup,
        showPopup,
        allProduct,
    } = useStoreAddProduct()

    // TODO: enable edditing for category and current products
    // TODO: fix picture loading on first load
    // TODO: show the data better with better UI/UX

    useEffect(() => {
        fetchCategories()
        fetchProducts()
    }, [allProduct.length]);

    return (
        <>
            {/* 3 input button */}
            {console.log("allProduct", allProduct)}
            <div>
                <div className="flex items-center justify-center mb-4">
                    <div className="flex w-full max-w-md space-x-2">
                        <input
                            type="text"
                            className="flex-1 pl-5 border border-gray-300 rounded shadow-sm"
                            placeholder="Search by Product ID..."
                        />
                        <button className="p-2 px-5 text-white bg-blue-500 rounded hover:bg-blue-600">
                            <AiOutlineSearch />
                        </button>
                        <button
                            onClick={() => setShowPopup(true)}
                            className="container mx-auto flex items-center justify-center p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            <AiOutlinePlus className="mr-2" /> Add Product
                        </button>
                    </div>
                    <div className="mt-4">
                        <CategoryManagement />
                    </div>
                </div>
                {/* popup menu to add product */}
                {showPopup && <PopUppAddProductForm />}
                {/* show existing product list */}
                <>
                    {/* show heading */}
                    <div className="mb-2 bg-gray-200 rounded-md border border-gray-400">
                        <div className="grid grid-cols-7 font-bold p-2 text-center items-center gap-x-2 border-b">
                            <span>Image</span>
                            <span>Name</span>
                            <span>Barcode</span>
                            <span>Description</span>
                            <span>Price</span>
                            <span>Available Quantity</span>
                            <span>Sold</span>
                        </div>
                    </div>
                    {/* display products in a grid layout */
                        console.log(allProduct.length !== 0)}
                    {console.log(allProduct)
                    }
                    <ul className="space-y-2">
                        {allProduct.length !== 0 && allProduct.map((product, index) => (
                            <li key={index} className="grid grid-cols-7 items-center bg-gray-100 p-2 rounded-md text-center gap-x-2 border-b border-gray-200 divide-x divide-gray-400">
                                <div>
                                    <div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>
                                    {product.imageFiles[0] !== null &&
                                        <>
                                            <Image
                                                src={product.picData}
                                                alt={product.imageFiles[0].imageId}
                                                className="w-16 h-16 object-cover rounded-lg mx-auto"
                                                width={160} height={160}
                                            />
                                        </>
                                    }
                                </div>
                                <span className="pl-2">{product.name}</span>
                                <span>{product.id}</span>
                                <span>{product.description}</span>
                                <span>${product.price}</span>
                                <span>{product.availableQuantity}</span>
                                <span>{product.sold}</span>
                            </li>
                        ))}
                    </ul>
                </>
            </div >
        </>
    );
};

export default AddProductPage;

