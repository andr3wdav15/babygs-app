import { useForm } from "react-hook-form";
import { Link, useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setIsLoggedIn } = useOutletContext();
  const [loginFail, setLoginFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const returnTo = decodeURIComponent(searchParams.get("returnTo") || "/");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          navigate(returnTo);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
        setLoginFail(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred during login");
      setLoginFail(true);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <h1 className="text-center mb-4">Login</h1>
          {loginFail && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            <div className="mb-3">
              <label
                className={`form-label ${errors.email ? "text-danger" : ""}`}
              >
                {errors.email ? errors.email.message : "Email"}
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
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
                  required: "Password is required",
                })}
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <Link to="/" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <Link to="/signup">Sign up</Link> now.
          </p>
        </div>
      </div>
    </div>
  );
}
