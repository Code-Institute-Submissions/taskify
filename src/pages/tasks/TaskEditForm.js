import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Col,
  Container,
  Alert,
  Modal,
  Row,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import axios from "axios";

function TaskEditForm() {
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);

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
    Set the state of the TaskData
  */
  const [taskData, setTaskData] = useState({
    title: "",
    task_body: "",
    priority: "",
    assigned_to: "",
    due_date: "",
    completed: "No",
  });
  const { title, task_body, priority, assigned_to, due_date, completed } =
    taskData;

  const history = useHistory();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  /* 
    Handle mount of task data from the API
  */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}/`);
        const {
          title,
          task_body,
          priority,
          assigned_to,
          due_date,
          completed,
          is_owner,
        } = data;

        is_owner
          ? setTaskData({
              title,
              task_body,
              priority,
              assigned_to,
              due_date,
              completed,
            })
          : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  /* 
    Handle change to taskData
  */
  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  /* 
    Handle submit of task edit form
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log("DATE:" + due_date);
    console.log("Assigned to:" + assigned_to);
    formData.append("title", title);
    formData.append("task_body", task_body);
    formData.append("priority", priority);
    if (assigned_to !== null && assigned_to !== "No one") {
      formData.append("assigned_to", assigned_to);
    }
    if (due_date !== null && due_date !== "") {
      formData.append("due_date", due_date);
    }
    formData.append("completed", completed);

    try {
      await axiosReq.put(`/tasks/${id}/`, formData);
      setShowModal(true);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  /* 
    Handle closure of feedback modal
  */
  const handleCloseModal = () => {
    setShowModal(false);
    history.push(`/tasks/${id}`);
  };

  const textFields = (
    <div className="text-center">
      <div>
        <h1>Edit Task</h1>
      </div>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          aria-label="title"
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Task Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="task_body"
          value={task_body}
          onChange={handleChange}
          aria-label="Task body"
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
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
          <option>No one</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
          ;
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Task completed</Form.Label>

        <Form.Control
          as="select"
          name="completed"
          value={completed}
          onChange={handleChange}
          aria-label="completed"
        >
          <option>Select task completed</option>
          <option value="NOT-STARTED">Not started</option>
          <option value="IN-PROGRESS">In-progress</option>
          <option value="COMPLETE">Complete</option>
        </Form.Control>
      </Form.Group>

      {errors?.completed?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <div className="d-flex justify-content-around">
        <Button  type="submit">
          Save
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
    Returns task edit form and associated feedback modals
  */
  return (
    <Row className="justify-content-center">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Form onSubmit={handleSubmit}>
          {showModal && (
            <Modal show={showModal} onHide={handleCloseModal} centered={true}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Task updated successfully!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          <div>
            <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
              <Container
                className={`d-flex flex-column justify-content-center`}
              >
                <div>{textFields}</div>
              </Container>
            </Col>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default TaskEditForm;
