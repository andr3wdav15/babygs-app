import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="container mt-5">
      <h1 className="mb-5 text-center">Home</h1>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.product_id}>
            <div className="card h-100">
              <img
                src={`${imageUrl}/${product.image_filename}`}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="card-text mb-0">${product.cost}</p>
                  <Link
                    to={`/details/${product.product_id}`}
                    className="btn btn-primary"
                  >
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
