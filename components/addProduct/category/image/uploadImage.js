"use client"
import { useRef } from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import useStoreUploadImage from '@/zustand/Uploadiamge/store';

const UploadImage = ({ exist }) => {
    const fileInputRef = useRef(null);
    const {
        handleImageChange,
        images,
        uploadProgress,
        removeImageById,
        updateImage
    } = useStoreUploadImage()

    return (
        <>
            <div>
                <button disabled={exist} type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Upload Images
                </button>
                <input disabled={exist} type="file" ref={fileInputRef} multiple onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            {/* Show images */}
            <div className="flex flex-col space-y-2">
                {images.map((image) => (
                    <div key={image.id} className="flex items-center space-x-2 p-2 border border-dashed rounded">
                        <img src={image.src} alt="Uploaded" className="w-20 h-20 object-cover" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}</p>
                            <p className="text-xs text-gray-500">{(image.size / 1024).toFixed(2)} KB</p>
                            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress[image.id] || 0}%` }}></div>
                            </div>
                        </div>
                        <button onClick={() => {
                            updateImage.map((img) => {
                                images.map((nImg) => {
                                    if (img.imageId === nImg.id) {
                                        removeImageById(image.id, `./DataBase/products/${img.productFolderName}/images/${img.pictureName}`)
                                    }
                                })
                            })
                        }}
                            className="text-red-500 hover:text-red-700">
                            <AiOutlineDelete />
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default UploadImage