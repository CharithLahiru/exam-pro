import "./App.css";
import Headder from "./commom-components/Headder";
import SearchBar from "./commom-components/Search-bar";
import Welcome from "./Home/Welcome";
import Stats from "./Home/stats";
import Categories from "./Home/Categories";
import Footer from "./commom-components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeachersHome from "./pages/TeachersHome";

function App() {
  return (
    <>
      <Router>
        <Headder />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchBar />
                  <Welcome />
                  <Stats />
                  <Categories />
                </>
              }
            />
            <Route path="/TeachersHome" element={<TeachersHome />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
