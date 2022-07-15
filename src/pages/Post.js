import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Post = () => {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { authState } = useContext(AuthContext);

  let history = useNavigate();

  useEffect(() => {
    axios
      .get(`https://full-stack-api-pedrotech.herokuapp.com/posts/byId/${id}`)
      .then((res) => {
        setPostObject(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://full-stack-api-pedrotech.herokuapp.com/comments/${id}`)
      .then((res) => {
        setComments(res.data);
      });
  }, []);

  const addComment = () => {
    axios
      .post(
        "https://full-stack-api-pedrotech.herokuapp.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: res.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`https://full-stack-api-pedrotech.herokuapp.com/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://full-stack-api-pedrotech.herokuapp.com/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        history("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title:");

      axios.put(
        `https://full-stack-api-pedrotech.herokuapp.com/posts/title`,
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter new text:");

      axios.put(
        `https://full-stack-api-pedrotech.herokuapp.com/posts/postText`,
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button onClick={() => deletePost(postObject.id)}>
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            type="text"
            placeholder="Comment..."
            autoComplete="off"
          />
          <button style={{ cursor: "pointer" }} onClick={() => addComment()}>
            Add Comment
          </button>
        </div>
        <div className="listOfComments">
          {comments.length !== undefined &&
            comments.map((comment, key) => (
              <div className="comment" key={key}>
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>
                    &times;
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
