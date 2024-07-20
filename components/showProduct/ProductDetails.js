import Image from 'next/image';

// TODO: fix and update
export default function ProductDetails({ product }) {
    // Assuming product.images is an array of image URLs
    const ImageSliderTile = ({ images }) => {
        return (
            <div className="tile">
                {images.map((img, index) => (
                    <Image key={index} src={img} alt={`Product Image ${index + 1}`} width={500} height={500} objectFit="contain" />
                ))}
            </div>
        );
    };

    const DataTile = ({ title, data }) => {
        return (
            <div className="tile">
                <h2>{title}</h2>
                <p>{data}</p>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ImageSliderTile images={product.images} />
            <DataTile title="Customers" data={product.customers.join(", ")} />
            <DataTile title="Sold" data={product.sold.toString()} />
            <DataTile title="Available Quantity" data={product.availableQuantity.toString()} />
            <DataTile title="Tracking Numbers" data={product.trackingNumbers.join(", ")} />
            {/* Additional tiles as needed */}
        </div>
    );
}
