import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Task from "./Task";
import Comment from "../comments/Comment";
import CommentForm from "../comments/CommentForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Col, Container } from "react-bootstrap";
import { useParams } from "react-router";

function TaskDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  /* 
    Fetch all tasks and their comments
  */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: tasks }, { data: comments }] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
          axiosReq.get(`/comments/?task=${id}`),
        ]);
        setTasks({ results: [tasks] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  /* 
    Returns detail page of task with comment form
  */
  return (
    <div className="h-100">
      <div >
        <h3>
          TASK DETAIL
        </h3>
      </div>
      <Task {...tasks.results[0]} setTasks={setTasks} taskDetail />
      <Container>
        {currentUser ? (
          <CommentForm
            profile_id={currentUser.profile_id}
            profileImage={profile_image}
            task={id}
            setTasks={setTasks}
            setComments={setComments}
          />
        ) : comments.results.length ? (
          "Comments"
        ) : null}
        {comments.results.length ? (
          comments.results.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              setTasks={setTasks}
              setComments={setComments}
            />
          ))
        ) : currentUser ? (
          <span>No comments yet, be the first to comment!</span>
        ) : (
          <span>No comments... yet</span>
        )}
      </Container>

      <Col md={4} className="d-none d-lg-block p-0 p-lg-2"></Col>
    </div>
  );
}

export default TaskDetail;
