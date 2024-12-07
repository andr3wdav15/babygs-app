import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";

export default function Checkout() {
  const [cookies, setCookie, removeCookie] = useCookies(["cart"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      is_pickup: "true",
      country: "Canada",
      province: "PEI",
    },
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/users/getSession`, {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
          setIsLoading(false);
        } else {
          navigate("/login?returnTo=/checkout");
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      if (
        !cookies.cart ||
        !Array.isArray(cookies.cart) ||
        cookies.cart.length === 0
      ) {
        return;
      }
      const cartString = cookies.cart
        .filter((item) => item && item.id && item.quantity)
        .map((item) => `${item.id}:${item.quantity}`)
        .join(",");

      if (!cartString) {
        return;
      }
      const cartData = {
        ...data,
        cart: cartString,
        is_pickup: data.is_pickup || false,
      };
      const response = await fetch(`${API_URL}/products/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      removeCookie("cart", { path: "/" });
      navigate("/confirmation");
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Please Login to Continue</h2>
          <p>You must be logged in to complete your purchase.</p>
          <Link 
            to={`/login?returnTo=${encodeURIComponent("/checkout")}`} 
            className="btn btn-primary"
          >
            Login to Checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <h4>Home Address</h4>
            <div className="mb-3">
              <label
                className={`form-label ${errors.street ? "text-danger" : ""}`}
              >
                {errors.street ? errors.street.message : "Street Address"}
              </label>
              <input
                type="text"
                className={`form-control ${errors.street ? "is-invalid" : ""}`}
                placeholder="e.g. 123 Main St"
                {...register("street", {
                  required: "Street address is required",
                  pattern: {
                    value: /^(\d+(-\d+)?|\d+\s*-\s*\d+)\s+[A-Za-z0-9\s\-\.]+$/,
                    message:
                      "Address must include number and street name (e.g. 1-123 Awesome St)",
                  },
                })}
              />
            </div>

            <div className="mb-3">
              <label
                className={`form-label ${errors.city ? "text-danger" : ""}`}
              >
                {errors.city ? errors.city.message : "City"}
              </label>
              <input
                type="text"
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                placeholder="e.g. Wood Islands"
                {...register("city", {
                  required: "City is required",
                  minLength: {
                    value: 3,
                    message: "City name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "City name cannot exceed 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s\-']+$/,
                    message:
                      "City name can only contain letters, spaces, hyphens and apostrophes",
                  },
                  setValueAs: (value) => {
                    return value
                      .trim()
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                  },
                })}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label
                  className={`form-label ${
                    errors.province ? "text-danger" : ""
                  }`}
                >
                  {errors.province ? errors.province.message : "Province"}
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.province ? "is-invalid" : ""
                  }`}
                  {...register("province", {
                    required: "Province is required",
                    validate: {
                      validFormat: (value) => {
                        const validFormats = [
                          "PEI",
                          "P.E.I.",
                          "Prince Edward Island",
                        ];
                        return (
                          validFormats.includes(value) ||
                          "Only available in PEI"
                        );
                      },
                    },
                    setValueAs: (value) => {
                      const normalized = value.trim().toUpperCase();
                      if (
                        normalized === "PEI" ||
                        normalized === "P.E.I." ||
                        normalized.toUpperCase() === "PRINCE EDWARD ISLAND"
                      ) {
                        return value.trim();
                      }
                      return value;
                    },
                  })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  className={`form-label ${
                    errors.postal_code ? "text-danger" : ""
                  }`}
                >
                  {errors.postal_code
                    ? errors.postal_code.message
                    : "Postal Code"}
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.postal_code ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. C1A 4P3"
                  {...register("postal_code", {
                    required: "Postal code is required",
                    pattern: {
                      value: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
                      message:
                        "Invalid postal code format (e.g. M5V 2T6 or M5V2T6)",
                    },
                    setValueAs: (value) => {
                      if (/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(value)) {
                        return value.slice(0, 3) + " " + value.slice(3);
                      }
                      return value;
                    },
                  })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                className={`form-label ${errors.country ? "text-danger" : ""}`}
              >
                {errors.country ? errors.country.message : "Country"}
              </label>
              <input
                type="text"
                className={`form-control ${errors.country ? "is-invalid" : ""}`}
                {...register("country", {
                  required: "Country is required",
                  validate: {
                    mustBeCanada: (value) =>
                      value === "Canada" || "Only available in Canada",
                  },
                  setValueAs: (value) => {
                    return value.trim() === "canada" ? "Canada" : value.trim();
                  },
                })}
              />
            </div>
          </div>

          <div className="col-md-6">
            <h4>Payment Information</h4>
            <div className="mb-3">
              <label
                className={`form-label ${
                  errors.credit_card ? "text-danger" : ""
                }`}
              >
                {errors.credit_card
                  ? errors.credit_card.message
                  : "Credit Card Number"}
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.credit_card ? "is-invalid" : ""
                }`}
                placeholder="e.g. 1111 1111 1111 1111"
                {...register("credit_card", {
                  required: "Credit card number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Card number must be 16 digits",
                  },
                  setValueAs: (value) => {
                    return value.replace(/[^\d]/g, "");
                  },
                })}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label
                  className={`form-label ${
                    errors.credit_expire ? "text-danger" : ""
                  }`}
                >
                  {errors.credit_expire
                    ? errors.credit_expire.message
                    : "Expiration (MM/YY)"}
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.credit_expire ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. 12/25"
                  {...register("credit_expire", {
                    required: "Expiration date is required",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: "Invalid expiry date format (MM/YY)",
                    },
                    validate: {
                      futureDate: (value) => {
                        if (!value) return true;
                        const [month, year] = value.split("/");
                        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                        const today = new Date();
                        today.setDate(1);
                        today.setHours(0, 0, 0, 0);
                        return expiry >= today || "Card has expired";
                      }
                    }
                  })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  className={`form-label ${
                    errors.credit_cvv ? "text-danger" : ""
                  }`}
                >
                  {errors.credit_cvv ? errors.credit_cvv.message : "CVV"}
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.credit_cvv ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. 123"
                  {...register("credit_cvv", {
                    required: "CVV is required",
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: "CVV must be 3 or 4 digits",
                    },
                  })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                className={`form-label ${
                  errors.phone_number ? "text-danger" : ""
                }`}
              >
                {errors.phone_number
                  ? errors.phone_number.message
                  : "Phone Number"}
              </label>
              <input
                type="tel"
                className={`form-control ${
                  errors.phone_number ? "is-invalid" : ""
                }`}
                placeholder="e.g. (555) 555-1234"
                {...register("phone_number", {
                  required: "Phone number is required",
                  validate: {
                    validFormat: (value) => {
                      const digitsOnly = value.replace(/\D/g, "");
                      if (digitsOnly.length === 10) {
                        return true;
                      }
                      if (
                        digitsOnly.length === 11 &&
                        digitsOnly.startsWith("1")
                      ) {
                        return true;
                      }
                      return "Please enter a valid 10 or 11-digit phone number";
                    },
                  },
                  setValueAs: (value) => {
                    const digitsOnly = value.replace(/\D/g, "");
                    const numberWithoutCountry = digitsOnly.startsWith("1")
                      ? digitsOnly.slice(1)
                      : digitsOnly;
                    if (numberWithoutCountry.length === 10) {
                      return `(${numberWithoutCountry.slice(
                        0,
                        3
                      )}) ${numberWithoutCountry.slice(
                        3,
                        6
                      )}-${numberWithoutCountry.slice(6)}`;
                    }
                    return value;
                  },
                })}
              />
            </div>

            <div className="mb-4">
              <label
                className={`form-label ${
                  errors.is_pickup ? "text-danger" : ""
                }`}
              >
                {errors.is_pickup
                  ? errors.is_pickup.message
                  : "Delivery Method"}
              </label>
              <div className="mt-1">
                <div className="form-check form-check-inline">
                  <input
                    className={`form-check-input ${
                      errors.is_pickup ? "is-invalid" : ""
                    }`}
                    type="radio"
                    value="true"
                    {...register("is_pickup", {
                      required: "Please select a delivery method",
                    })}
                  />
                  <label className="form-check-label">Store Pickup</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className={`form-check-input ${
                      errors.is_pickup ? "is-invalid" : ""
                    }`}
                    type="radio"
                    value="false"
                    {...register("is_pickup", {
                      required: "Please select a delivery method",
                    })}
                  />
                  <label className="form-check-label">Home Delivery</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2 col-md-6 mx-auto mt-4">
          <button type="submit" className="btn btn-success btn-lg">
            Complete Purchase
          </button>
          <Link to="/cart" className="btn btn-outline-secondary">
            Back to Cart
          </Link>
        </div>
      </form>
    </div>
  );
}
