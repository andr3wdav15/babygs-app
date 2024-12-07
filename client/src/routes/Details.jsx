import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cookies, setCookie] = useCookies(["cart"]);
  const [isAdding, setIsAdding] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
      }
    };

    fetchProduct();
  }, [apiUrl, id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    let currentCart = Array.isArray(cookies.cart) ? cookies.cart : [];

    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.product_id
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      const newItem = {
        id: product.product_id,
        name: product.name,
        cost: product.cost,
        image: product.image_filename,
        quantity: 1,
      };
      currentCart.push(newItem);
    }

    setCookie("cart", currentCart, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="container mt-5">
      {product ? (
        <>
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <img
                src={`${imageUrl}/${product.image_filename}`}
                className="img-fluid mb-4"
                alt={product.name}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">
                      ${Number(product.cost).toFixed(2)}
                    </p>
                    <div>
                      <button
                        onClick={handleAddToCart}
                        className={`btn ${
                          isAdding ? "btn-success" : "btn-success"
                        } me-2`}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Added!
                          </>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                      <Link to="/" className="btn btn-outline-secondary">
                        Go Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
