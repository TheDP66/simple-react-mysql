import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ThumbIcon = ({ opacity }) => {
  return (
    <svg
      fill="white"
      opacity={opacity}
      width="25px"
      height="25px"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.47 0c-.19.02-.37.15-.47.34-.13.26-1.09 2.19-1.28 2.38-.19.19-.44.28-.72.28v4h3.5c.21 0 .39-.13.47-.31 0 0 1.03-2.91 1.03-3.19 0-.28-.22-.5-.5-.5h-1.5c-.28 0-.5-.25-.5-.5s.39-1.58.47-1.84c.08-.26-.05-.54-.31-.63-.07-.02-.12-.04-.19-.03zm-4.47 3v4h1v-4h-1z" />
    </svg>
  );
};

const Home = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  let history = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history("/login");
    }

    axios
      .get("https://full-stack-api-pedrotech.herokuapp.com/posts", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setListOfPosts(res.data.listOfPosts);
        console.log("res.data.likedPosts", res.data.likedPosts);
        setLikedPosts(
          res.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "https://full-stack-api-pedrotech.herokuapp.com/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (res.data.liked) {
                return {
                  ...post,
                  Likes: [...post.Likes, 0],
                };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();

                return {
                  ...post,
                  Likes: likesArray,
                };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
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
            <div className="username">
              <Link to={`/profile/${value.UserId}`} className="username">
                {value.username}
              </Link>
            </div>
            <div
              className="buttons"
              onClick={() => {
                likeAPost(value.id);
              }}
              style={{ width: "auto" }}
            >
              {console.log("likedPosts", likedPosts)}
              {console.log("value.id", value.id)}
              <ThumbIcon
                opacity={likedPosts.includes(value.id) ? "1" : "0.5"}
              />
              <label>{value.Likes.length}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
