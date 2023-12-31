import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import PasswordCriteria from "../../components/PasswordCriteria";

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  /* 
    handles change in userData
  */
  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  /* 
    Validate user is owner of profile and if not
    return to home page
  */
  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      history.push("/");
    }
  }, [currentUser, history, id]);

  /* 
    Handle submit of new password form
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      setShowModal(true);
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  /* 
    handle closing of feedback modal
  */
  const handleCloseModal = () => {
    setShowModal(false);
    history.goBack();    
  };

  /* 
    Returns password edit form and feedback modal
  */
  return (
    <Row>
      <Col className="py-2 mx-auto text-center font-weight-bold" md={8}>
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Password updated successfully!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <h3>Change password</h3>
              <Form.Label>New password</Form.Label>
              <Form.Control
                placeholder="enter new password"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
                className="text-center"
                aria-label="new password"
              />
            </Form.Group>

            {errors?.new_password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
                className={`text-center`}
                aria-label="confirm new password"
              />

              <PasswordCriteria />
            </Form.Group>

            {errors?.new_password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Button
              type="submit"
              className={`mx-2 my-2`}
              onMouseDown={(event) => event.preventDefault()}
            >
              Save
            </Button>
            <Button
              onMouseDown={(event) => event.preventDefault()}
              className={`mx-2`}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;