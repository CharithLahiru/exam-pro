import "./App.css";
import Headder from "./pages/common-components/Headder";
import SearchBar from "./pages/common-components/Search-bar";
import Welcome from "./pages/Home/Welcome";
import Stats from "./pages/Home/stats";
import Categories from "./pages/Home/Categories";
import Footer from "./pages/common-components/Footer";
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
              path="/exam-pro"
              element={
                <>
                  <SearchBar />
                  <Welcome />
                  <Stats />
                  <Categories />
                </>
              }
            />
            <Route path="/exam-pro/TeachersHome" element={<TeachersHome />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
