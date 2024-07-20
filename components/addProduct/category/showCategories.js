import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import useStoreAddProduct from '@/zustand/Addproduct/store';

const ShowCategories = () => {
    const {
        categories,
        deleteCategory,
        removeSubCategory,
    } = useStoreAddProduct()
    return (
        <>
            <ul className="space-y-2">
                {categories.map((category, index) => (
                    category.headCategory == "" && (
                        <div key={index} className='bg-gray-100 mt-2 rounded-xl'>
                            <li key={index} className="flex justify-between items-center p-2 ">
                                {category.id}
                                <div>
                                    {/* // TODO: fix edit button */}
                                    <button className="text-red-600 hover:text-red-700 ml-2" onClick={() => deleteCategory(category.id)}>
                                        <AiOutlineDelete />
                                    </button>
                                </div>
                            </li>
                            <ul>
                                {category.subCategories.map((sub, index2) => (
                                    <>
                                        <div className='grid grid-cols-3' style={{ gridTemplateColumns: '5% 90% 5%' }} >
                                            <div className=''></div>
                                            <li key={index2} className="border border-dotted bg-gray-300 rounded-xl flex justify-between items-center p-1 mt-1">
                                                {sub}
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => {
                                                        removeSubCategory(category.id, sub)
                                                        deleteCategory(sub)
                                                    }}
                                                >
                                                    <AiOutlineDelete />
                                                </button>
                                            </li>
                                        </div>
                                        <ul>
                                            {categories.map((subOfSub) => (
                                                subOfSub.id === sub && (
                                                    subOfSub.subCategories.map((subName, index3) => (
                                                        <>
                                                            <div div className='grid grid-cols-3' style={{ gridTemplateColumns: '13% 80% 7%' }} >
                                                                <div></div>
                                                                <li key={index3} className="border border-dotted bg-gray-300 rounded-xl flex justify-between items-center p-1 mt-1">
                                                                    {subName}
                                                                    <button
                                                                        className="text-red-500 hover:text-red-700"
                                                                        onClick={() => {
                                                                            removeSubCategory(sub, subName)
                                                                            deleteCategory(subName)
                                                                        }}
                                                                    >
                                                                        <AiOutlineDelete />
                                                                    </button>
                                                                </li>
                                                            </div>
                                                        </>
                                                    ))
                                                )
                                            ))}
                                        </ul>
                                    </>
                                ))
                                }
                            </ul >
                        </div >
                    )
                ))}
            </ul >
        </>
    )
}

export default ShowCategories