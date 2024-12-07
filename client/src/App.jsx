import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "./ui/Nav";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/users/getSession`, {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} />
      <div>
        <Outlet context={{ setIsLoggedIn }} />
      </div>
    </>
  );
}

export default App;
