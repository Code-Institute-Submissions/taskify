import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Form, Button, Modal } from "react-bootstrap";

function CommentEditForm(props) {
  const { id, comment_body, setShowEditForm, setComments } = props;

  const [formContent, setFormContent] = useState(comment_body);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  /* 
    Handle comment form submit
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        comment_body: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                comment_body: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditForm(false);
  };

  /* 
    Returns comment edit form
  */
  return (
    <Form onSubmit={handleSubmit}>
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Comment updated successfully!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div>
        <Button
          disabled={!comment_body.trim()}
          type="submit"
        >
          Save
        </Button>
        <Button
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
