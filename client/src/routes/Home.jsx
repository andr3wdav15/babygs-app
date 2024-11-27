import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/all`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  return (
    <div>
      <div className="products-all">
        {products.map((product) => (
          <div key={product.product_id} className="product">
            <div className="product-image">
              <img
                src={`${imageUrl}/${product.image_filename}`}
                alt={product.name}
              />
            </div>
            <h3>{product.name}</h3>
            <p>${product.cost}</p>
            <Link to={`/details/${product.product_id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
