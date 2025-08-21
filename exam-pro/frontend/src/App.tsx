import "./App.css";
import Headder from "./commom-components/Headder";
import SearchBar from "./commom-components/Search-bar";
import Welcome from "./Home/Welcome";

function App() {
  return (
    <>
      <body>
        <Headder></Headder>

        <SearchBar></SearchBar>

        <section>
          <Welcome></Welcome>
        </section>
        <section></section>
        <section></section>
        <section></section>
      </body>
    </>
  );
}

export default App;
