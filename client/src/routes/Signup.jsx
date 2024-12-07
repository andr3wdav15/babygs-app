import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [signupFail, setSignupFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  async function formSubmit(data) {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          (await response.text()) ||
          "Signup failed. Please try again.";
        setErrorMessage(errorMessage);
        setSignupFail(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSignupFail(true);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <h1 className="text-center mb-4">Signup</h1>
          {signupFail && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit(formSubmit)} method="post">
            <div className="mb-3">
              <label
                className={`form-label ${
                  errors.firstName ? "text-danger" : ""
                }`}
              >
                {errors.firstName ? errors.firstName.message : "First Name"}
              </label>
              <input
                {...register("firstName", {
                  required: "First Name is required.",
                })}
                type="text"
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="mb-3">
              <label
                className={`form-label ${errors.lastName ? "text-danger" : ""}`}
              >
                {errors.lastName ? errors.lastName.message : "Last Name"}
              </label>
              <input
                {...register("lastName", {
                  required: "Last Name is required.",
                })}
                type="text"
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="mb-3">
              <label
                className={`form-label ${errors.email ? "text-danger" : ""}`}
              >
                {errors.email ? errors.email.message : "Email"}
              </label>
              <input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="text"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
            </div>
            <div className="mb-3">
              <label
                className={`form-label ${errors.password ? "text-danger" : ""}`}
              >
                {errors.password ? errors.password.message : "Password"}
              </label>
              <input
                {...register("password", {
                  required: "Password is required.",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                    message:
                      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.",
                  },
                })}
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
              <Link to="/login" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>
          </form>
          <p className="text-center mt-4">
            Already have an account? <Link to="/login">Login</Link> now.
          </p>
        </div>
      </div>
    </div>
  );
}
