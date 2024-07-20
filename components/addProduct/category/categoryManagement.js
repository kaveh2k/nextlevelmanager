import React from 'react'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import ManageSubCategory from './manageSubCategory';
import ShowCategories from './showCategories';
import useStoreAddProduct from '@/zustand/Addproduct/store';

const CategoryManagement = () => {
    const {
        isCategoryPopupOpen,
        newCategory,
        setIsCategoryPopupOpen,
        setNewCategory,
        addCategory,
        headingCategoryNum,
        setHeadingCategoryNum,
        setHeadingCategory,
    } = useStoreAddProduct()
    return (
        <>
            <div className="pl-2">
                <button
                    className="mb-4 bg-blue-500 text-white p-2 rounded"
                    onClick={() => setIsCategoryPopupOpen(true)}
                >
                    Manage Categories
                </button>

                {isCategoryPopupOpen && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded-lg w-full max-w-2xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Category Management</h2>
                                <button onClick={() => setIsCategoryPopupOpen(false)}>
                                    <AiOutlineClose />
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    className="flex-grow p-2 border rounded"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New Category"
                                />
                                <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={() => {
                                    setHeadingCategoryNum(0)
                                    setHeadingCategory("")
                                    addCategory(headingCategoryNum)
                                }}>
                                    <AiOutlinePlus />
                                </button>
                            </div>
                            {/* Main categories */}
                            <ShowCategories />
                            {/* Sub categories */}
                            <ManageSubCategory />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CategoryManagement