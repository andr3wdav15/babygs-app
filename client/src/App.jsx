import { Outlet } from "react-router-dom";
import Nav from "./ui/Nav";

function App() {
  return (
    <>
      <Nav />
      <hr></hr>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
