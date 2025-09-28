import './App.css';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import Signin from "./pages/signin";
import UserMenu from "./components/UserMenu";
import { isAuthenticated } from "./utils/auth";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <img className="App-book" src={require('./assets/images/book.png')} alt="Loading..."></img>
            <h2>Library</h2>
          </div>
          <div className="header-right">
            {isAuthenticated() && <UserMenu />}
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
