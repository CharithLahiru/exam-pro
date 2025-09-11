import { useState } from "react";
import examProLogo from "../assets/examProLogo.svg";
import "./Headder.css";
import { Link } from "react-router-dom";

const Headder = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setShowForgotPassword(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login form submitted");
  };

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested");
    setShowForgotPassword(false);
  };

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
              <a href="#categories" className="nav-link">
                Courses
              </a>
              <Link to="/TeachersHome" className="btn-secondary">
                Continue as Teacher
              </Link>
              <a onClick={openLoginModal} className="btn-primary">
                Log In
              </a>
            </div>
          </nav>
        </div>
      </header>

      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeLoginModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>Welcome Back</h2>
              <p>Please fill in your details to continue</p>
            </div>

            {!showForgotPassword ? (
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="form-input"
                    // minLength="8"
                  />
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="profilePicture" className="file-label">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile Preview"
                          className="profile-preview"
                        />
                      ) : (
                        <div className="upload-placeholder">
                          <span>📷</span>
                          <span>Choose Photo</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button type="submit" className="login-submit-btn">
                  Sign In
                </button>
              </form>
            ) : (
              <form
                className="forgot-password-form"
                onSubmit={handleForgotPassword}
              >
                <div className="modal-header">
                  <h3>Reset Password</h3>
                  <p>Enter your email to receive reset instructions</p>
                </div>
                <div className="form-group">
                  <label htmlFor="resetEmail">Email Address *</label>
                  <input
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="login-submit-btn">
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="back-to-login"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Headder;
