import { useContext, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Login from "./Components/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  return (
    <BrowserRouter>
      <div className="main">{loggedIn ? <Header /> : <Login />}</div>
    </BrowserRouter>
  );
}

export default App;
