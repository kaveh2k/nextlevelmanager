"use client"
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageWithLoading from '@/components/showProduct/ImageWithLoading';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Slide transition interval in milliseconds
    };

    const mockData = [
        {
            id: "1",
            barcode: "123456789",
            name: "Wireless Mouse",
            availableQuantity: 150,
            sold: 50,
            images: ["/images/mouse1.jpg", "/images/mouse2.jpg", "/images/mouse3.jpg"],
            description: "A high-quality wireless mouse with ergonomic design. Features include 2.4 GHz wireless connectivity, an adjustable DPI, and a comfortable grip.",
            price: "29.99",
            category: "Electronics",
            customers: ["Alice", "Bob", "Charlie"],
            trackingNumbers: ["XYZ123", "ABC456"],
        },
        {
            id: "2",
            barcode: "987654321",
            name: "Mechanical Keyboard",
            availableQuantity: 100,
            sold: 75,
            images: ["/images/keyboard1.jpg", "/images/keyboard2.jpg", "/images/keyboard3.jpg"],
            description: "Mechanical keyboard with customizable RGB lighting. Features tactile switches for responsive typing, programmable macros, and durable keycaps.",
            price: "89.99",
            category: "Accessories",
            customers: ["Dave", "Eve", "Frank"],
            trackingNumbers: ["LMN789", "OPQ012"],
        },
        // Example of another product to demonstrate variety
        {
            id: "3",
            barcode: "112233445",
            name: "Bluetooth Speakers",
            availableQuantity: 200,
            sold: 120,
            images: ["/images/speaker1.jpg", "/images/speaker2.jpg"],
            description: "Portable Bluetooth speakers with excellent sound quality. Features long battery life, waterproof design, and Bluetooth 5.0 connectivity.",
            price: "59.99",
            category: "Audio",
            customers: ["Gina", "Howard", "Irene"],
            trackingNumbers: ["QRS567", "TUV890"],
        }
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearched(true);
        setIsLoading(true);
        // TODO: add api  call here for searching products by keyword in the database
        // Simulate an API call
        setTimeout(() => {
            const filteredData = mockData.filter(product => product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
            setResults(filteredData);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form
                className={`transition-all duration-700 ease-in-out transform ${isSearched ? 'absolute top-5 left-1/2 -translate-x-1/2 w-2/6' : 'w-11/12 '}`}
                onSubmit={handleSearch}
            >
                <div className="flex items-center bg-white border-2 border-gray-300 rounded-full overflow-hidden">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`flex-grow text-xl focus:outline-none rounded-l-full ${isSearched ? `p-3` : `p-7`}`}
                        placeholder="Search for a product by barcode..."
                    />

                    <button type="submit" className={`${isSearched ? `p-3` : `p-7`} bg-blue-500 text-white hover:bg-blue-600 focus:outline-none rounded-r-full mx-auto my-auto`}>
                        <AiOutlineSearch size={24} />
                    </button>
                </div>
            </form>
            {/* {isSearched && !isLoading && results && (           ******  مثل فروشگاه میشه! *****
                <div className="results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
                    {results.map(product => (
                        <ProductTile key={product.id} product={product} />
                    ))} 
                </div>
            )} */}
            {!isLoading && isSearched && results && results.map(product => (
                <>
                    {/* <div className="tile flex-none" style={{ maxWidth: '300px' }}>
                        <img src={product.images[currentImg]} alt="Product" className="w-full h-auto rounded-lg" />
                        <div className="flex justify-center gap-2 my-2">
                            <button onClick={prevImg}>&lt;</button>
                            <button onClick={nextImg}>&gt;</button>
                        </div>
                    </div> */}
                    <div key={product.id} className="flex flex-col items-center justify-center">
                        <div className="tile" style={{ maxWidth: '300px', margin: '0 auto' }}>
                            <Slider {...settings}>
                                {product.images.map((img, index) => (
                                    <div key={index}>
                                        <ImageWithLoading src={img} alt={`Product Image ${index + 1}`} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className="tile">Description: {product.description}</div>
                        <div className="tile">Price: {product.price}</div>
                        {/* Implement image slider for product.images */}
                        <div className="tile">Sold: {product.sold}</div>
                        <div className="tile">Available Quantity: {product.availableQuantity}</div>
                        {/* List customers */}
                        <div className="tile">Customers: {product.customers.join(", ")}</div>
                        {/* List tracking numbers */}
                        <div className="tile">Tracking Numbers: {product.trackingNumbers.join(", ")}</div>
                        <div className="flex flex-wrap justify-center items-start my-5">

                        </div>
                    </div>
                </>
            ))}
            {isLoading && <>
                <div role="status" class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <span class="sr-only">Loading...</span>
                </div>
            </>}
        </div>
    );
}
