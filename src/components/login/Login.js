import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appwriteApi from "../../api/appwriteApi";
import styles from "./Login.module.css";
import yachtLogo from "../../images/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Button,
  Center,
  Text,
  useToast,
} from "@chakra-ui/react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });

  const [showPassword, setShowPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalEmail, setModalEmail] = useState(""); // State for modal email input
  const [value, setValue] = useState({
    phone: "",
    otp: "",
  });
  const [user, setUser] = useState(null);
  const [isPhoneVerify, setIsPhoneVerify] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const toast = useToast();
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      return;
    } else if (/^\+[1-9][0-9]{1,8}$/.test(phoneNumber)) {
      setPhoneError("Invalid phone number");
      return;
    } else {
      setPhoneError("");
      appwriteApi.createPhoneSession(phoneNumber)
        .then((res) => {
          setUser(res.userId);
          setIsPhoneVerify(true);
          toast({
            title: "Otp is sent successfully to your phone number!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((e) => {
          toast({
            title: "Error:" + e,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const handleValidatePhone = (e) => {
    e.preventDefault();
    appwriteApi.updatePhoneSession(user, value.otp)
      .then((res) => {
        if (typeof onLogin === "function") {
          onLogin();
        }
        navigate("/home");
        
      })
      .catch((e) => {
       
        toast({
          title: "Error validating session!" + e,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  const validateForm = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill in all fields");
      return false;
    }
    if (!values.email) {
      setErrorMsg("Please enter your email address");
      return false;
    } else if (!validateEmail(values.email)) {
      setErrorMsg("Please enter a valid email address");
      return false;
    }
    if (!values.pass) {
      setErrorMsg("Please enter your password");
      return false;
    } else if (!validatePassword(values.pass)) {
      setErrorMsg("Please enter your correct password.");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    return regex.test(password);
  };

  const handleSubmission = async () => {
    if (!validateForm()) {
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      //const user = await account.get(null);
      //if (user.emailVerification) {
      await appwriteApi.createEmailSession(values.email, values.pass);
      setSubmitButtonDisabled(false);

      // Call the onLogin function to update the isLoggedIn state in the App component
      if (typeof onLogin === "function") {
        onLogin();
      }
      // Call the onLogin function to update the isLoggedIn state in the App component
      if (typeof onLogin === "function") {
        onLogin();
      }

      navigate("/home");
    } catch (error) {
      setSubmitButtonDisabled(false);
      setErrorMsg(error.message);
    }
  };

  const handleInputType = (event) => {
    event.preventDefault();
  };

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();

    try {
      appwriteApi.createOAuth2Session(
        "google",
        process.env.REACT_APP_BASE_URL + "/home",
        process.env.REACT_APP_BASE_URL + "/login"
      );
      if (typeof onLogin === "function") {
        onLogin();
      }
    } catch (error) {
      console.log("Google Error", error);
    }
  };

  const handleModalSubmission = async () => {
    // Perform the recovery logic here
    try {
      await appwriteApi.createRecovery(
        modalEmail,
        process.env.REACT_APP_BASE_URL + "/reset-password"
      );
      console.log("Recovery link sent successfully");
    } catch (error) {
      console.log("Error sending recovery link:", error);
    }
    setShowModal(false); // Close the modal
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={yachtLogo} alt="Yacht Logo" className={styles.logo} />
        </div>
        <h1 className={`${styles.title} ${styles.stylishFont}`}>
          Expense tracker
        </h1>
      </header>
      <div className={styles.innerBox}>
        <h2 style={{ textAlign: "center" }}>LOGIN</h2>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter Email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={values.pass}
              onCopy={handleInputType}
              onCut={handleInputType}
              onPaste={handleInputType}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
              placeholder="Enter Password"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                backgroundColor="transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className={styles.eyeIcon}
                />
              </Button>
            </InputRightElement>
          </InputGroup>
          <br />
          <Link
            style={{
              color: "#1877f2",
              fontSize: "14px",
              fontWeight: 500,
              float: "right",
            }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Link>
        </FormControl>
        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button disabled={submitButtonDisabled} onClick={handleSubmission}>
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <span>
              <Link to="/signup">Signup</Link>
            </span>
          </p>
        </div>
      
        <div>
          {isPhoneVerify ? (
            // Verify OTP using phone session
            <form onSubmit={handleValidatePhone}>
              <FormControl mb={4}>
                <FormLabel>OTP</FormLabel>
                <Input
                  type="number"
                  name="otp"
                  placeholder="Enter Otp"
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <Button colorScheme="blue" type="submit">
                Validate OTP
              </Button>
            </form>
          ) : (
            // Get Phone Session Form
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Login With Phone Number</FormLabel>
               
                <PhoneInput
                  placeholder="Enter phone number"
                  countryCallingCodeEditable={false}
                  international
                  defaultCountry="IN" // Set your desired default country
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputComponent={Input} // Use Chakra UI Input component
                  required
                />
                {phoneError && (
                  <Text color="red" fontSize="sm">
                    {phoneError}
                  </Text>
                )}
              </FormControl>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleModalClose}>
              &times;
            </span>
            <h2>Forgot Password</h2>
            <input
              type="email"
              value={modalEmail}
              onChange={(event) => setModalEmail(event.target.value)}
              placeholder="Enter email address"
            />
            <button
              onClick={(e) => {
                handleModalSubmission();
              }}
            >
              Send Recovery Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
