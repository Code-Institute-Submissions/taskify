import React, { useState, useEffect } from "react"
import { Alert, Form, Button, Col, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import axios from "axios";

function TaskCreateForm() {
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);  

  /* 
    Fetch all profiles from the API
  */
  useEffect(() => {
    axios
      .get("/profile-list/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  }, []);

  /* 
    Fetch state for Task
  */
  const [taskData, setTaskData] = useState({
    title: "",
    task_body: "",
    priority: "LOW",
    assigned_to: "",
    due_date: "",
  });
  const { title, task_body, priority, assigned_to, due_date } = taskData;

  const history = useHistory();

  /* 
    Handle change of TaskData
  */
  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  /* 
    Handle submit of task creation form
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("task_body", task_body);
    formData.append("priority", priority);
    formData.append("assigned_to", assigned_to);
    formData.append("due_date", due_date);

    try {
      await axiosReq.post("/tasks/", formData);
      setShowModal(true);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  /* 
    Handle close of feedback modal
  */
  const handleCloseModal = () => {
    setShowModal(false);
    history.push(`/tasks/`);  
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>

        <Form.Control
          name="title"
          value={title}
          onChange={handleChange}
          aria-label="title"
        ></Form.Control>
      </Form.Group>

      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Details</Form.Label>

        <Form.Control
          as="textarea"
          name="task_body"
          value={task_body}
          onChange={handleChange}
          aria-label="task_body"
        ></Form.Control>
      </Form.Group>

      {errors?.task_body?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Due date</Form.Label>

        <Form.Control
          name="due_date"
          type="date"
          value={due_date}
          onChange={handleChange}
          aria-label="due_date"
        ></Form.Control>
      </Form.Group>

      {errors?.due_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Priority</Form.Label>

        <Form.Control
          as="select"
          name="priority"
          value={priority}
          onChange={handleChange}
          aria-label="priority"
        >
          <option>Select task priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </Form.Control>
      </Form.Group>

      {errors?.priority?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Assigned to</Form.Label>

        <Form.Control
          as="select"
          name="assigned_to"
          value={assigned_to}
          onChange={handleChange}
          aria-label="assigned_to"
        >
          <option>Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
          ;
        </Form.Control>
      </Form.Group>

      {errors?.assigned_to?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <div className="d-flex justify-content-around">
        <Button type="submit">
          Submit
        </Button>

        <Button
            onClick={() => history.goBack()}
        >
          Cancel
        </Button>
      </div>
      
    </div>
  );

  /* 
    Returns the task create form and associated feedback
    modals
  */
  return (
    <Form onSubmit={handleSubmit}>
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Task created successfully!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <div>
        <Col md={7} lg={8}>
          <div
            className='d-flex flex-column justify-content-center'
          >
            <h3>Create Task</h3>
            <div>
              {textFields}
            </div>
          </div>
        </Col>
      </div>
    </Form>
  );
}

export default TaskCreateForm;
