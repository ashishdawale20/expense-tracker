import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appwriteApi from "../../api/appwriteApi";
import styles from "./Signup.module.css";
import yachtLogo from "../../images/logo.jpg";
import Phone from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";

function Signup() {
  const [number, setNumber] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [showConfPassword, setShowConfPassword] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: number,
    email: "",
    pass: "",
    confirmPass: "",
  });

  const validateForm = () => {
    if (!values.firstName) {
      setErrorMsg("Please enter your first name");
      return false;
    } else if (values.firstName.length < 2) {
      setErrorMsg("Please enter a valid first name");
      return false;
    } else if (!validateName(values.firstName)) {
      setErrorMsg("Please enter a valid first name");
      return false;
    }
    if (!values.lastName) {
      setErrorMsg("Please enter your last name");
      return false;
    } else if (values.lastName.length < 2) {
      setErrorMsg("Please enter a valid last name");
      return false;
    } else if (!validateName(values.lastName)) {
      setErrorMsg("Please enter a valid last name");
      return false;
    }
    if (!number) {
      setErrorMsg("Please enter your phone number");
      return false;
    } else if (!validatePhoneNumber(number)) {
      setErrorMsg("Please enter a valid phone number");
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
    } else if (values.pass.length < 6) {
      setErrorMsg("Password should be at least 8 characters long");
    } else if (!validatePassword(values.pass)) {
      setErrorMsg(
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }
    if (!values.confirmPass) {
      setErrorMsg("Please confirm your password");
      return false;
    } else if (values.confirmPass !== values.pass) {
      setErrorMsg("Passwords do not match");
      return false;
    }
    if (
      !values.firstName ||
      !values.lastName ||
      !number ||
      !values.email ||
      !values.pass ||
      !values.confirmPass
    ) {
      setErrorMsg("Please fill in all the required fields");
      return false;
    }
    return true;
  };
  const validateName = (firstName) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(firstName.toString());
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 12) {
      return true;
    } else {
      return false;
    }
  };

  const validatePassword = (password) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    return re.test(password);
  };

  const handleSubmission = () => {
    if (!validateForm()) {
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);

    appwriteApi.createAccount(
      values.email,
      values.pass,
      values.firstName + " " + values.lastName
    )

      .then(() => {
        return appwriteApi.createEmailSession(values.email, values.pass);
      })
      .then(() => {
        return appwriteApi.createVerification(
          process.env.REACT_APP_BASE_URL + "/Verification"
        );
      })
      .then(() => {
        setSubmitButtonDisabled(false);
        registerUser();
        alert(
          "Register Successfully. Please check your inbox for email verification."
        );
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const registerUser = () => {
    
    const promise = appwriteApi.createDocument(
      process.env.REACT_APP_APPWRITE_DATABASE_ID,
      process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
      {
        email: values.email,
        role: "user",
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: number,
      }
    );

    promise.then(() => {
    }).catch((error) => {

    });
  }
  const handleInputType = (event) => {
    event.preventDefault();
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
        <h1 className={styles.heading}>SIGNUP</h1>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            value={values.firstName}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, firstName: event.target.value }))
            }
            placeholder="Enter first name"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={values.lastName}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, lastName: event.target.value }))
            }
            placeholder="Enter last name"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Phone
            containerStyle={{ color: "black" }}
            placeholder="Enter phone number"
            inputStyle={{
              width: 480,
              height: 45,
              marginTop: 0,
              backgroundColor: "transparent",
            }}
            type="text"
            country={"in"}
            enableAreaCodes={true}
            onChange={(event) => setNumber(event)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter email"
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
        </FormControl>

        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showConfPassword ? "text" : "password"}
              value={values.confirmPass}
              onCopy={handleInputType}
              onCut={handleInputType}
              onPaste={handleInputType}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  confirmPass: event.target.value,
                }))
              }
              placeholder="Enter confirm password"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                backgroundColor="transparent"
                onClick={() => setShowConfPassword((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={showConfPassword ? faEye : faEyeSlash}
                  className={styles.eyeIcon}
                />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            Signup
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;