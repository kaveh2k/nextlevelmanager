"use client"
import { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineDelete } from 'react-icons/ai';
import useStoreAddProduct from '@/zustand/Addproduct/store';
import useStoreSellProduct from '@/zustand/Sell/store';

// TODO: add reference number
// TODO: add date of issue

const SellItems = () => {
    const {
        fetchCategories,
        fetchProducts,
    } = useStoreAddProduct()
    const {
        findProduct,
        loadPicture,
        clearLoadedPics,
        setTotalPriceForEachProduct,
        totalPriceForEachProduct,
        deleteTotalPriceForEachProduct,
    } = useStoreSellProduct()

    useEffect(() => {
        fetchCategories()
        fetchProducts()
    }, []);
    const [barcode, setBarcode] = useState('');

    const [productsList, setProductsList] = useState([]);
    const [productInvoiceList, setProductInvoiceList] = useState([]);


    const [totalPrice, setTotalPrice] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [priceHighlight, setPriceHighlight] = useState('');

    const handleProductIds = () => {
        const tempArr = []
        productInvoiceList.map((item) => {
            tempArr.push({ id: item.barcode, quantity: item.amount })
        })
        return tempArr
    }
    const handleCheckout = async (customerId, totalPrice, totalQuantity) => {
        const createInvoice = {
            customerId: customerId,
            productIds: handleProductIds(),
            total: totalPrice,
            quantity: totalQuantity
        }
        await window.api.createInvoice(createInvoice)
    }

    // TODO: use useState to get the data from the input
    // TODO: change all the functions
    // TODO: break the code into several components
    // TODO: add customer data form

    const handleShowTotal = () => {
        let newTotalPrice = 0.0
        let newTotalQuantity = 0.0
        productInvoiceList.forEach(element => {
            newTotalPrice += Number(element.totalPrice)
            newTotalQuantity += Number(element.amount)
        });
        if (newTotalPrice > totalPrice) {
            setPriceHighlight('increase');
        } else if (newTotalPrice < totalPrice) {
            setPriceHighlight('decrease');
        }
        return { newTotalPrice, newTotalQuantity };
    }

    useEffect(() => {
        const { newTotalPrice, newTotalQuantity } = handleShowTotal();
        setTotalPrice(newTotalPrice.toFixed(2));
        setTotalQuantity(newTotalQuantity);
        // Recalculate total price whenever the productsList changes
        // Reset the highlight after some time
        const timeoutId = setTimeout(() => {
            setPriceHighlight('');
        }, 1000); // 1 seconds for the shine effect
        return () => clearTimeout(timeoutId);
    }, [productInvoiceList]);


    const handleNewProductToList = async (product, imageData, quantity = 1) => {
        setProductInvoiceList([...productInvoiceList, {
            barcode: product.id,
            pic: imageData,
            pName: product.id,
            price: product.price,
            amount: 1,
            totalPrice: (quantity * product.price).toFixed(2),
        }]);
        setTotalPriceForEachProduct(product.id, product.price, quantity)
    }
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!productInvoiceList.find(item => item.barcode === barcode)) {
            const productToAdd = await findProduct(barcode)
            if (productToAdd.productExist) {
                setProductsList([...productsList, productToAdd.findProduct])
                await loadPicture(`${productToAdd.findProduct.imageFiles[0].productFolderName}/images/${productToAdd.findProduct.imageFiles[0].pictureName}`, 2)
                // console.log("loadedPicsForInvoice[0]: ", loadedPicsForInvoice[0]);
                console.log("productToAdd.findProduct: ", productToAdd.findProduct);
                await handleNewProductToList(productToAdd.findProduct, productToAdd.productFirstImage)
                await clearLoadedPics(2)
            } else {
                setShowAlert(true);
            }
        } else {
            const newAmount = Number(totalPriceForEachProduct.find(item => item.id == barcode).amount) + 1;
            const updateBarcode = productInvoiceList.find(item => item.barcode === barcode).barcode
            handleQuantityChange(updateBarcode, newAmount)
        }
        // setBarcode(''); // Clear input field
    };

    const handleQuantityChange = (barcode, newQuantity) => {
        const updatedProductsList = productInvoiceList.map((pr, ind) => (
            pr.barcode == barcode ? { ...pr, amount: parseInt(newQuantity, 10), totalPrice: (newQuantity * pr.price).toFixed(2) } : pr
        ))
        updatedProductsList.map((prod, i) => {
            setTotalPriceForEachProduct(prod.barcode, prod.totalPrice, newQuantity)
        })
        setProductInvoiceList(updatedProductsList)
    };

    const handleDeleteProduct = (productId) => {
        const temArrProductInvoiceList = productInvoiceList
        const tempArrProductsList = productsList
        temArrProductInvoiceList.forEach((product, index) => {
            if (product.barcode === productId) {
                temArrProductInvoiceList.splice(index, 1)
            }
        });
        tempArrProductsList.forEach((product, index) => {
            if (product.barcode === productId) {
                tempArrProductsList.splice(index, 1)
            }
        });
        const { newTotalPrice, newTotalQuantity } = handleShowTotal();
        setPriceHighlight('decrease');
        setTotalPrice(newTotalPrice.toFixed(2));
        setTotalQuantity(newTotalQuantity);
        setProductInvoiceList(temArrProductInvoiceList);
        setProductsList(tempArrProductsList);
        deleteTotalPriceForEachProduct(productId)
    };

    return (
        <div className="p-4">
            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <p className="mb-4">Product not found. Please check the barcode and try again.</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={(e) => handleAddProduct(e)} className="flex items-center justify-center mb-4">
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter product barcode..."
                    className="input border border-gray-300 p-5 rounded-l-md w-[20%]"
                />
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-r-md">
                    <AiOutlineSearch />
                </button>
            </form>

            <div className="mb-2 bg-gray-200 rounded-md border border-gray-400">
                <div className="grid grid-cols-7 font-bold p-2 text-center items-center gap-x-2 border-b">
                    <span>Image</span>
                    <span>Description</span>
                    <span>Barcode</span>
                    <span>Price</span>
                    <span>Total Price</span>
                    <span>Quantity</span>
                    <span>Delete</span>
                </div>
            </div>


            {console.log("productInvoiceList: ", productInvoiceList)}
            {console.log("productsList: ", productsList)}
            <ul className="space-y-2">
                {/* TODO: set condition to do not show until productsList array exist */}
                {productInvoiceList.map((product, index) => (
                    <li key={index} className="grid grid-cols-7 items-center bg-gray-100 p-2 rounded-md text-center gap-x-2 border-b border-gray-200 divide-x divide-gray-400">
                        <div>
                            <img
                                src={product.pic}
                                alt={product.pName}
                                className="w-16 h-16 object-cover rounded-lg mx-auto"
                            />
                        </div>
                        <span className="pl-2">{product.pName}</span>
                        <span>${product.barcode}</span>
                        <span>${product.price}</span>
                        {/* quantity to sell, it's editable */}
                        <span>${totalPriceForEachProduct.map((pr) => (pr.id === product.barcode && pr.totalPrice))}</span>
                        <span className=''>
                            <input
                                type="number"
                                value={productInvoiceList.find(x => x.barcode == product.barcode).amount}
                                onChange={(e) => handleQuantityChange(product.barcode, e.target.value)}
                                className="input border border-gray-300 text-center mx-auto w-[35%]"
                                min="1"
                            />
                        </span>
                        <span>
                            <button onClick={() => handleDeleteProduct(product.barcode)} className="btn bg-transparent hover:bg-red-500 mx-auto p-6 text-red-500 hover:text-white rounded-lg">
                                <AiOutlineDelete />
                            </button>
                        </span>
                    </li>
                ))}
            </ul>

            {productsList.length > 0 && (
                <div className="flex justify-end mt-4">
                    <div className={`border rounded-lg p-2 max-w-xs ${priceHighlight === 'increase' ? 'animate-increase' : priceHighlight === 'decrease' ? 'animate-decrease' : ''} transition-all duration-150 ease-in-out`}>
                        <p className="font-bold">Total Price: ${totalPrice}</p>
                        <p className="font-bold">Total Quantity: {totalQuantity}</p>
                    </div>
                    <button onClick={() => handleCheckout("in-shop", totalPrice, totalQuantity)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default SellItems