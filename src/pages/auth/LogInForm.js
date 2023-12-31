import React, { useState } from "react";
import axios from "axios";
import { Alert, Form, Button, Col, Row, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import loginImage from "../../assets/login-image.jpg";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  /*
    Handles submit of login form
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.push("/");
      console.log({ setCurrentUser });
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  /*
    Handle changes input fields
  */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  /*
    Returns login form
  */
  return (
      <Row className="mt-5">
        <Col md={6} className="d-flex align-items-center">
          <Container className={` p-4`}>
            <h1>Log in!</h1>
            <p>Please enter your credentials below.</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
              ))}

              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
              ))}
              <Button type="submit">Log in</Button>
              {errors.non_field_errors?.map((message, idx) => (
                  <Alert key={idx} variant="warning" className="mt-3">
                    {message}
                  </Alert>
              ))}
            </Form>
            <p className="text-capitalize mt-5">Don't have an account?</p>
            <Link to="/signup">
              <p className="text-black-50">Click here to Sign up!</p>
            </Link>
          </Container>
        </Col>
        <Col md={6} className="d-none d-md-flex">
          <img src={loginImage} alt="Login" />
        </Col>
      </Row>
  );
}

export default SignInForm;
