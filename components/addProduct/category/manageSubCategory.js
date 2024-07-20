import React from 'react'
import CategoryDropDown from '@/components/addProduct/category/categoryDropDownMenu/categoryDropDown'
import useStoreAddProduct from '@/zustand/Addproduct/store'

const ManageSubCategory = () => {
    const {
        selectedCategoryId,
        categories,
        setHeadingCategoryNum,
        setHeadingCategory,
        subCategoryName,
        setSubCategoryName,
        setSelectedCategoryId,
        addSubCategory,
    } = useStoreAddProduct()
    let head = 0
    const findHead = async () => {
        await categories.map(cat => {
            if (cat.id === selectedCategoryId) {
                head = cat.headNum
            }
        })
    }

    return (
        <>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Manage Sub-Categories</h3>
                {/* Dropdown to select a category for adding sub-categories */}
                <CategoryDropDown isRequired={false} onChangeSelect={(e) => setSelectedCategoryId(e.target.value)} isHeading={true} />

                {/* Input field for new sub-category name */}
                <input className="p-2 border rounded w-full"
                    placeholder="New Sub-Category Name"
                    value={subCategoryName}
                    onChange={(e) =>
                        setSubCategoryName(e.target.value)
                    }
                />

                {/* Button to add new sub-category */}
                <button
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded block w-full"
                    onClick={async () => {
                        await findHead()
                        console.log("head is: ", head)
                        if (head == 0) {
                            await setHeadingCategoryNum(1)
                            await setHeadingCategory(`${selectedCategoryId}`);
                        } else if (head == 1) {
                            await setHeadingCategoryNum(2)
                            await setHeadingCategory(`${selectedCategoryId}`);
                        }
                        await addSubCategory();
                    }}
                >
                    Add Sub-Category
                </button>
            </div>
        </>
    )
}

export default ManageSubCategory