import './App.css';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import Signin from "./pages/signin";
import BookEdit from "./pages/book-edit";
import BookNew from "./pages/book-new";
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
          <Route path="/book-edit" element={<BookEdit />} />
          <Route path="/book-new" element={<BookNew />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
