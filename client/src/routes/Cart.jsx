import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty. <Link to="/">Continue shopping</Link></p>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            {cartItems.map((item, index) => (
              <div className="card mb-3" key={index}>
                <div className="row g-0">
                  <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <img
                      src={`${imageUrl}/${item.image}`}
                      alt={item.name}
                      className="img-fluid rounded-start"
                    />
                  </div>
                  <div className="col-md-8 d-flex align-items-center">
                    <div className="card-body d-flex justify-content-between align-items-center w-100">
                      <div>
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Price: ${Number(item.cost).toFixed(2)}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-3"
                          onClick={() => removeItem(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-end align-items-center mt-4">
              <h5 className="mb-0 me-3">Subtotal: ${subtotal.toFixed(2)}</h5>
              <Link to="/" className="btn btn-secondary me-3">Continue Shopping</Link>
              <Link to="/checkout" className="btn btn-primary">Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}