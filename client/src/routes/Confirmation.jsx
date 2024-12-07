import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Confirmation() {
  return (
    <div className="container mt-5">
      <div className="card text-center">
        <div className="card-body">
          <i
            className="bi bi-check-circle text-success icon-large"
            style={{ fontSize: "4rem" }}
          ></i>
          <h2 className="card-title mt-3">Thank You for Your Order!</h2>
          <p className="card-text">
            We have received your order and will process it shortly.
          </p>

          <hr className="my-4" />
          <div className="d-inline-block mx-auto p-3">
            <h5 className="text-center mb-3">Contact Us </h5>
            <div className="text-center">
              <p className="mb-1">
                123 Queen Street
                <br />
                Charlottetown, PE C1A 4B3
              </p>
              <p className="mb-1">(902) 555-0123</p>
              <p className="mb-1">support@babygs.ca</p>
            </div>
          </div>

          <div className="mt-4">
            <Link to="/" className="btn btn-success">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
