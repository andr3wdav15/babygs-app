import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cookies, setCookie] = useCookies(["cart"]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products${id ? `/${id}` : ''}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    let currentCart = Array.isArray(cookies.cart) ? cookies.cart : [];

    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.product_id
    );

    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add it with quantity 1
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
  };

  return (
    <div>
      <h2>{product.name}</h2>
      <div className="product-image">
        <img src={`${imageUrl}/${product.image_filename}`} alt={product.name} />
      </div>
      <p>{product.description}</p>
      <p>Price: ${Number(product.cost).toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <div className="product-options">
        <Link to="/">
          <button>Go Back</button>
        </Link>
      </div>
    </div>
  );
}
