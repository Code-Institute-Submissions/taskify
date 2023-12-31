import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Container, OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { DropDown } from "../../components/DropDown";
import axios from "axios";

const Task = (props) => {
  const {
    id,
    owner,
    title,
    profile_id,
    profile_image,
    created_on,
    due_date,
    priority,
    task_body,
    watching_id,
    taskDetail,
    setTasks,
    assigned_to,
    completed,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [assignedUser, setAssignedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /*
    Handle edit of Task
  */
  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  /*
    Handle delete of Task
  */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      history.push(`/`);
    } catch (err) {
      console.log(err);
      setShowDeleteModal(false);
    }
  };

  /*
    Handle watch relationship creation between
    user and task
  */
  const handleWatch = async () => {
    try {
      const { data } = await axiosRes.post("/watches/", { task: id });
      setTasks((prevtasks) => ({
        ...prevtasks,
        results: prevtasks.results.map((task) => {
          return task.id === id ? { ...task, watching_id: data.id } : task;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  /*
    Handle deletion of watch relationship between
    user and task
  */
  const handleUnwatch = async () => {
    try {
      await axiosRes.delete(`/watches/${watching_id}/`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.map((task) => {
          return task.id === id ? { ...task, watching_id: null } : task;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  /*
    Determine Colour of Completed field div border
  */
  const backgroundColorClass = (() => {
    switch (completed) {
      case "COMPLETE":
        return "border-success";
      case "IN-PROGRESS":
        return "border-warning";
      case "NOT-STARTED":
        return "border-danger";
      default:
        return "";
    }
  })();

  /*
    Fetch username of assigned to field for current task
  */
  useEffect(() => {
    if (assigned_to) {
      axios.get(`/profiles/${assigned_to}/`).then((response) => {
        setAssignedUser(response.data.owner);
      });
    } else {
      setAssignedUser("Nobody yet");
    }
  }, [assigned_to]);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  /*
    Returns task with all fields populate by the DRF
    Includes deletion and edit modal
  */
  return (
      <Card className={`${backgroundColorClass} mt-5 mb-5` }>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            {is_owner && taskDetail && (
                <DropDown handleEdit={handleEdit} handleDelete={() => setShowDeleteModal(true)} />
            )}
          </div>
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered={true}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          <Link to={`/tasks/${id}`}>
            <Container>Task: {title}</Container>
          </Link>
          <Container className="d-flex justify-content-between">
            <div>
              <div>
                Posted by:{" "}
                <Link to={`/profiles/${profile_id}`}>
                  <span>{owner}</span> <Avatar src={profile_image} height={55} />
                </Link>
              </div>
            </div>
            <div>Posted on: {created_on}</div>
            <div>
              Due Date:
              {due_date && isNaN(Date.parse(due_date)) === false ? (
                  <span>{new Date(due_date).toLocaleString("en-GB", options).replace(/\//g, " ")}</span>
              ) : (
                  <span>No date allocated</span>
              )}
            </div>
            <div>Priority: {priority}</div>
          </Container>
          <hr />
          <div>
            <div>Detail of task</div>
            <div>{task_body}</div>
          </div>
          <hr />
        </Card.Body>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <div>Status: {completed}</div>
            {assigned_to ? (
                <Link to={`/profiles/${assigned_to}`}>
                  <div>Assigned to: {assignedUser}</div>
                </Link>
            ) : (
                <div>Assigned to: {assignedUser}</div>
            )}
            <div>
              {is_owner ? (
                  <OverlayTrigger placement="top" overlay={<Tooltip>You already own this Task!</Tooltip>}>
                    <i className="fas fa-eye-low-vision" />
                  </OverlayTrigger>
              ) : watching_id ? (
                  <OverlayTrigger placement="top" overlay={<Tooltip>Unwatch Task!</Tooltip>}>
                <span onClick={handleUnwatch}>
                  <i className="fas fa-eye-slash" />
                </span>
                  </OverlayTrigger>
              ) : currentUser ? (
                  <OverlayTrigger placement="top" overlay={<Tooltip>Watch Task!</Tooltip>}>
                <span onClick={handleWatch}>
                  <i className="fas fa-eye" />
                </span>
                  </OverlayTrigger>
              ) : (
                  <OverlayTrigger placement="top" overlay={<Tooltip>Log in to watch this Task!</Tooltip>}>
                    <i className="far fa-eye" />
                  </OverlayTrigger>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
  );
};

export default Task;
