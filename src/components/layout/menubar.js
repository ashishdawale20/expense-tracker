import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import appwriteApi from "../../api/appwriteApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BiLogOut } from "react-icons/bi";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import logo from "../../images/logo.jpg"
import styles from "./MenuBar.module.css";


const MenuBar = ({ isSignedIn, signout }) => {
  const [userTeams, setUserTeams] = useState([]);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdateModalOpen, setUpdateIsModalOpen] = useState(false);

  const openUpdateModal = () => {
    setUpdateIsModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSignout = async () => {
    try {

      // Delete all sessions (logout from all devices)
      await appwriteApi.deleteSessions();

      signout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchCurrentUserName();
    }
  }, [isSignedIn, userData]);


 

  const fetchCurrentUserName = async () => {
    try {
      const response = await appwriteApi.getAccount();
      setUserData(response);
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  };

  const productScreenPath = "/products";
  const isProductScreen = location.pathname === productScreenPath;
  const boatDetailsScreenPath = "/boatDetails";
  const isboatDetailsScreen = location.pathname === boatDetailsScreenPath;

  return (
    <>
      <nav
        className={`${styles.navbar} navbar navbar-expand-lg navbar-dark bg-gradient`}
        style={
          isProductScreen || isboatDetailsScreen
            ? { position: "fixed", top: 0, width: "100%", zIndex: 100 }
            : {}
        }
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="Logo"
              className={`${styles.logoImage} ${styles.rotating}`}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className={`navbar-nav ml-auto ${styles.navbarNav}`}>
              {isSignedIn && (
                <li className="nav-item">
                  <Link
                    to="/home"
                    className={`nav-link ${styles.navLink}`}
                    style={{ color: "white" }}
                  >
                    Home
                  </Link>
                </li>
              )}
              {isSignedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/Dashboard"
                      className={`nav-link ${styles.navLink}`}
                      style={{ color: "white" }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/ExcelUploadAndSubmit"
                      className={`nav-link ${styles.navLink}`}
                      style={{ color: "white" }}
                    >
                      ImportExpense
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {isSignedIn && (
            <div>
              <Menu>
                <MenuButton
                  size="sm"
                  bg="lightgreen"
                  _hover={{ bg: "teal.500" }}
                  css={{
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    _hover: {
                      bg: "none",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  {userData ? (
                    <span
                      style={{
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        fontSize: 20,
                        textShadow: "1px 1px #ff0000",
                      }}
                    >
                      {userData.name?.charAt(0)}
                    </span>
                  ) : (
                    <span>?</span>
                  )}
                </MenuButton>
                <MenuList>
                  {" "}
                  <MenuItem onClick={openModal}>Open Your Profile</MenuItem>
                  <MenuItem onClick={openUpdateModal}>
                    Update Your Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleSignout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "#36a8f4",
                      color: "white",
                      borderRadius: "4px",
                      padding: "8px 16px",
                    }}
                  >
                    Logout <BiLogOut style={{ marginLeft: "8px" }} />
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default MenuBar;
