import React from 'react'
import useStoreAddProduct from '@/zustand/Addproduct/store'

const CategoryDropDown = ({ isRequired, onChangeSelect, isHeading, exist }) => {
    const {
        selectedCategoryId,
        categories
    } = useStoreAddProduct()
    return (
        <select
            disabled={exist}
            name="category"
            placeholder="Category"
            className="mb-2 p-2 border rounded w-full"
            value={selectedCategoryId || ""}
            onChange={onChangeSelect}
            required={isRequired}
        >
            <option value={""}>Select Category</option>
            {console.log("categories is: ", categories)}
            {categories.map((category, index) => (
                (category.headNum == 0 && (// show main categories 
                    <>
                        <option key={index} value={category.id}>{category.id}</option>
                        {category.subCategories.map((subCategory, subIndex) => ( // show sub categories under each category
                            <>
                                <option key={subIndex} value={subCategory}>
                                    ┗{subCategory}
                                </option>
                                {
                                    isHeading === false && (
                                        categories.map((cat, index) => (
                                            <>
                                                {cat.headCategory == subCategory && (
                                                    <option key={index} value={cat.id}>
                                                        ┗{cat.id}
                                                    </option>
                                                )}
                                            </>
                                        ))
                                    )
                                }
                            </>
                        ))
                        }
                    </>
                ))))}
        </select>
    )
}

export default CategoryDropDown