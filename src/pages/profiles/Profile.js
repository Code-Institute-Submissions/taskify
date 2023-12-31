import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Profile = (props) => {
  const { id, image, owner, mobile, imageSize = 55, job_role, created_on } = props;

  /* 
    Returns user profile based on Profile Props
  */
  return (
      <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
        <div>
          <Link to={`/profiles/${id}`}>
            <Avatar src={image} height={imageSize} />
          </Link>
        </div>
        <div className="mx-2">
          <Link className="text-dark" to={`/profiles/${id}`}>
            <strong>{owner}</strong>
          </Link>
        </div>
        <div className="text-dark text-info">
          - {job_role} - Member since - {created_on}.
        </div>
      </div>
  );
};

export default Profile;
