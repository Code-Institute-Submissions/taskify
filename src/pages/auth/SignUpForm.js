import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Alert,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import PasswordCriteria from "../../components/PasswordCriteria";
import signupImage from "../../assets/signup-image.jpg";

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const history = useHistory();

  /*
    Handle changes input fields
  */
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  /*
    Handle submit of signup form
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      setShowModal(true);
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  /*
    Handle modal close
  */
  const handleCloseModal = () => {
    setShowModal(false);
    history.push(`/signin`);
  };

  /*
    Returns signup form
  */
  return (
      <Row className="mt-5">
        <Col md={6} className="d-flex align-items-center">
          <Container className={` p-4`}>
            <h1>Sign up!</h1>
            <p>Please enter your sign up details below.</p>
            <Form onSubmit={handleSubmit}>
              {showModal && (
                  <Modal show={showModal} onHide={handleCloseModal} centered={true}>
                    <Modal.Header closeButton>
                      <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Account created successfully!</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
              )}
              <Form.Group controlId="username">
                <Form.Label className="d-none">username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
              ))}

              <Form.Group controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                />
              </Form.Group>
              {errors.password1?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
              ))}

              <Form.Group controlId="password2">
                <Form.Label className="d-none">Confirm password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                />
                <PasswordCriteria />
              </Form.Group>
              {errors.password2?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
              ))}

              <Button type="submit">Sign up</Button>
              {errors.non_field_errors?.map((message, idx) => (
                  <Alert key={idx} variant="warning" className="mt-3">
                    {message}
                  </Alert>
              ))}
            </Form>
            <p className="mb-3 mt-3">Already have an account?</p>
            <Link to="/signin">
              <p className="text-black-50">Click here to Log in!</p>
            </Link>
          </Container>
        </Col>
        <Col md={6} className={`d-none d-md-flex`}>
          <img src={signupImage} alt="Signup" />
        </Col>
      </Row>
  );
};

export default SignUpForm;
