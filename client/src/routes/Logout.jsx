import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Logout() {
  const [cookies, setCookie, removeCookie] = useCookies(["cart"]);
  const [logoutStatus, setLogoutStatus] = useState({
    done: false,
    error: null,
  });
  const { setIsLoggedIn } = useOutletContext();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch(`${API_URL}/users/logout`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          setIsLoggedIn(false);
          removeCookie("cart", { path: "/" });
          setLogoutStatus({ done: true, error: null });
        } else {
          setLogoutStatus({
            done: true,
            error: "Logout failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Logout failed:", error);
        setLogoutStatus({
          done: true,
          error: "An error occurred during logout.",
        });
      }
    };

    performLogout();
  }, [setIsLoggedIn]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4 text-center">
          <h1 className="mb-4">Logout</h1>

          {!logoutStatus.done ? (
            <div className="mb-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Logging out...</p>
            </div>
          ) : logoutStatus.error ? (
            <div className="alert alert-danger mb-4">{logoutStatus.error}</div>
          ) : (
            <div className="alert alert-success mb-4">
              You have been successfully logged out.
            </div>
          )}

          <div className="d-grid gap-2">
            <Link to="/login" className="btn btn-primary">
              Login Again
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
