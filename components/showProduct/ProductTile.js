// components/ProductTile.js
import Image from 'next/image';
import styles from './ProductTile.module.css'; // Assume we will create this CSS module for styling
// TODO: fix and update / update style
export default function ProductTile({ product }) {
    return (
        <div className={styles.tile}>
            <Image src={product.image} alt={product.name} width={150} height={150} />
            <h3 className={styles.title}>{product.name}</h3>
            <p>Available Quantity: {product.availableQuantity}</p>
            <p>Sold: {product.sold}</p>
            <div>Customers: {product.customers.join(", ")}</div>
            <div>Tracking Numbers: {product.trackingNumbers.join(", ")}</div>
        </div>
    );
}
