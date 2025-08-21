import examProLogo from "../assets/examProLogo.svg";
import "./Headder.css";
const Headder = () => {
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <img src={examProLogo} alt="Logo" width={100}></img>
            </div>
            <div className="nav-links">
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#" className="nav-link">
                Courses
              </a>
              <a href="#" className="nav-link">
                Practice
              </a>
              <a href="#" className="btn-secondary">
                Continue as Teacher
              </a>
              <a href="#" className="btn-primary">
                Log In
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Headder;
