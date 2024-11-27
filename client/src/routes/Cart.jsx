import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Cart() {
  const [cookies, setCookie] = useCookies(["cart"]);
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const cartItems = Array.isArray(cookies.cart) ? cookies.cart : [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.cost) * item.quantity,
    0
  );

  const removeItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCookie("cart", updatedCart, { path: "/" });
  };

  const updateQuantity = (index, change) => {
    const updatedCart = [...cartItems];
    const newQuantity = updatedCart[index].quantity + change;

    if (newQuantity < 1) {
      removeItem(index);
    } else {
      updatedCart[index].quantity = newQuantity;
      setCookie("cart", updatedCart, { path: "/" });
    }
  };

  return (
    <>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="product-image">
                <img src={`${imageUrl}/${item.image}`} alt={item.name} />
              </div>
              <h3>{item.name}</h3>
              <p>Price: ${Number(item.cost).toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(index, -1)}>-</button>
                <button onClick={() => updateQuantity(index, 1)}>+</button>
              </div>
            </div>
          ))}
          <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
          <Link to="/checkout">
            <button>Checkout</button>
          </Link>
        </>
      )}
      <Link to="/">
        <button>Continue Shopping</button>
      </Link>
    </>
  );
}
