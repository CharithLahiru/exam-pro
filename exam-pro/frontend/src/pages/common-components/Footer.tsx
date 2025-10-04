import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" className="footer-link">
              About Us
            </a>
            <a href="#" className="footer-link">
              Articles
            </a>
            <a href="#" className="footer-link">
              FAQ
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
            <a href="#" className="footer-link">
              System Status
            </a>
            <a href="#" className="footer-link">
              Terms of Use
            </a>
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
          </div>
          <div className="copyright">
            © 2025 ExamPro Training Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
