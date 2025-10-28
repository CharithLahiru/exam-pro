import { useState, useEffect } from "react";
import examProLogo from "../../assets/examProLogo.svg";
import "../common-components/Headder.css";
import { Link, useLocation } from "react-router-dom";
import AccountService from "../../service/account/AccountService";
import type {
  AccountInformation,
  SignInInformation,
} from "../../data/account/AccountInformation";

const Headder = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const location = useLocation();
  const [buttonText, setButtonText] = useState("Continue as Teacher");
  const [buttonRoute, setButtonRoute] = useState("/exam-pro/TeachersHome");
  const accountService = new AccountService();

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (location.pathname === "/exam-pro") {
      setButtonText("Continue as Teacher");
      setButtonRoute("/exam-pro/TeachersHome");
    } else if (location.pathname === "/exam-pro/TeachersHome") {
      setButtonText("Continue as Student");
      setButtonRoute("/exam-pro");
    } else {
      setButtonText("Continue as Teacher");
      setButtonRoute("/exam-pro/TeachersHome");
    }
  }, [location.pathname]);

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage or session for logged in user
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setUserName(userData.username || userData.firstName || "User");
      setUserProfileImage(userData.profileImage || null);
    }
  }, []);

  const openSignInModal = () => {
    setIsSignInModalOpen(true);
    setIsCreateAccountModalOpen(false);
    setShowForgotPassword(false);
  };

  const openCreateAccountModal = () => {
    setIsCreateAccountModalOpen(true);
    setIsSignInModalOpen(false);
    setShowForgotPassword(false);
  };

  const closeAllModals = () => {
    setIsSignInModalOpen(false);
    setIsCreateAccountModalOpen(false);
    setShowForgotPassword(false);
    setProfileImage(null);
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

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const credentials: SignInInformation = {
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const response = await accountService.signIn(credentials);

      const statusCode = response.status;
      if (statusCode === 200) {
        setPasswordError("");
      } else if (statusCode === 400) {
        setPasswordError("Invalid username or password");
        return;
      } else {
        setPasswordError("An error occurred. Please try again.");
        return;
      }

      // Simulate successful login
      const userData = {
        username: credentials.username,
        firstName: credentials.username,
        profileImage: null, // Will be set if user has uploaded image
      };

      // Store user data
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      // Update state
      setIsLoggedIn(true);
      setUserName(userData.username);
      setUserProfileImage(userData.profileImage);

      closeAllModals();
    } catch (error) {
      console.log("Sign in failed:", error);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const accInfo: AccountInformation = {
      userId: formData.get("userId")
        ? Number(formData.get("userId"))
        : undefined,
      username: String(formData.get("username") || ""),
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: formData.get("email")?.toString() || null,
      mobile: formData.get("mobile")?.toString() || null,
      accountType: formData.get("accountType")?.toString() || "ROLE_STUDENT",
      isActive: true,
      password: String(formData.get("password") || ""),
    };

    try {
      const response = await accountService.saveAccountInformation(accInfo);
      console.log("Account created successfully:", response.data);

      // Auto login after account creation
      const userData = {
        username: accInfo.username,
        firstName: accInfo.firstName,
        profileImage: profileImage,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setIsLoggedIn(true);
      setUserName(accInfo.firstName || accInfo.username);
      setUserProfileImage(profileImage);

      closeAllModals();
    } catch (error) {
      console.log("Account creation failed:", error);
    }
  };

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("resetEmail");

    console.log("Password reset requested for:", email);
    // Add your password reset logic here
    setShowForgotPassword(false);
    setIsSignInModalOpen(true);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setUserName("");
    setUserProfileImage(null);
    setShowUserDropdown(false);
    console.log("User logged out");
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-profile-container")) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserDropdown]);

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <img src={examProLogo} alt="Logo" width={100}></img>
            </div>
            <div className={`nav-links ${menuOpen ? "active" : ""}`}>
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#categories" className="nav-link">
                Courses
              </a>
              <Link to={buttonRoute} className="btn-secondary">
                {buttonText}
              </Link>

              {isLoggedIn ? (
                <div className="user-profile-container">
                  <button
                    className="user-profile-button"
                    onClick={toggleUserDropdown}
                  >
                    {userProfileImage ? (
                      <img
                        src={userProfileImage}
                        alt="User Profile"
                        className="user-profile-image"
                      />
                    ) : (
                      <div className="user-profile-icon">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {showUserDropdown && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{userName}</p>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <button
                        className="user-dropdown-item"
                        onClick={handleLogout}
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a onClick={openSignInModal} className="btn-primary">
                  Sign In
                </a>
              )}
            </div>
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
          </nav>
        </div>
      </header>

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>
              ×
            </button>

            <div className="modal-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            {!showForgotPassword ? (
              <form className="create-account-form" onSubmit={handleSignIn}>
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
                  />
                  {passwordError && (
                    <div className="error-message">{passwordError}</div>
                  )}
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="create-account-submit-btn">
                  Sign In
                </button>

                <div className="form-footer">
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={openCreateAccountModal}
                      className="link-button"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
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
                  <button type="submit" className="create-account-submit-btn">
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="back-to-create-account"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {isCreateAccountModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>
              ×
            </button>

            <div className="modal-header">
              <h2>Create Account</h2>
              <p>Please fill in your details to get started</p>
            </div>

            <form
              className="create-account-form"
              onSubmit={handleCreateAccount}
            >
              <div className="form-group">
                <label htmlFor="create-username">Username *</label>
                <input
                  type="text"
                  id="create-username"
                  name="username"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-password">Password *</label>
                <input
                  type="password"
                  id="create-password"
                  name="password"
                  required
                  className="form-input"
                  minLength={8}
                />
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

              <button type="submit" className="create-account-submit-btn">
                Create Account
              </button>

              <div className="form-footer">
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={openSignInModal}
                    className="link-button"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Headder;
