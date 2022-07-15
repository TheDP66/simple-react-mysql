import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  let history = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://full-stack-api-pedrotech.herokuapp.com/auth/basicinfo/${id}`
      )
      .then((res) => {
        setUsername(res.data.username);
      });

    axios
      .get(
        `https://full-stack-api-pedrotech.herokuapp.com/posts/byUserId/${id}`
      )
      .then((res) => {
        setListOfPosts(res.data);
      });
  }, []);

  return (
    <div className="profilePageContaier">
      <div className="basicInfo" style={{ textAlign: "center" }}>
        <h1>Username: {username}</h1>
        {authState.username === username && (
          <button
            onClick={() => history(`/changepassword/`)}
            style={{ cursor: "pointer" }}
          >
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => (
          <div key={key} className="post">
            <div
              className="title"
              onClick={() => {
                history(`/post/${value.id}`);
              }}
            >
              {value.title}
            </div>
            <div
              className="body"
              onClick={() => {
                history(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">{value.username}</div>
              <div className="buttons" style={{ width: "auto" }}>
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
