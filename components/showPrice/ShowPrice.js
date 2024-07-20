import React from 'react'

const ShowPrice = ({ priceHighlight, totalPrice, totalQuantity }) => {
    return (
        <div className={`border rounded-lg p-2 max-w-xs ${priceHighlight === 'increase' ? 'animate-increase' : priceHighlight === 'decrease' ? 'animate-decrease' : ''} transition-all duration-150 ease-in-out`}>
            <p className="font-bold">Total Price: ${totalPrice}</p>
            <p className="font-bold">Total Quantity: {totalQuantity}</p>
        </div>
    )
}

export default ShowPrice