import React from "react";
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import  DataContext from "./context/DataContext";
import { useNavigate } from "react-router-dom";
import api from "./api/posts";

const PostPage = () => {

  const { posts, setPosts } = useContext(DataContext);
  
  const { id } = useParams();
  const post = posts.find((post) => post.id === id);
  
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <main className="PostPage">
      <article className="post">
        {post && (
          <>
            <h2>{post.title}</h2>
            <p className="postDate">{post.datetime}</p>
            <p className="postBody">{post.body}</p>
            <Link to={`/edit/${post.id}`}><button className="editButton">Edit Post</button></Link>
            <button className="deleteButton" onClick={() => handleDelete(post.id)}>Delete</button>
          </>
        )}
        {!post && (
          <>
            <p>Post not found!</p>
            <p>
              <Link to="/"> Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
