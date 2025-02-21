import React from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy";
import { format } from "date-fns";

const EditPost = () => {
  const { id } = useParams();

  const editTitle = useStoreState((store) => store.editTitle);
  const setEditTitle = useStoreActions((store) => store.setEditTitle);

  const editBody = useStoreState((store) => store.editBody);
  const setEditBody = useStoreActions((store) => store.setEditBody);

  const editPost = useStoreActions((actions) => actions.editPost);

  const getPostById = useStoreState((state) => state.getPostById);
  const post = getPostById(id);

  const navigate = useNavigate();


  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post]);

  const handleEdit = async (id) => {
    const updatedPost = {
      id,
      title: editTitle,
      body: editBody,
      datetime: format(new Date(), "MMMM dd, yyyy pp"),
    };
    editPost(updatedPost);
    navigate(`/post/${id}`);
  };

  return (
    <main className="NewPost">
      {editTitle && (
        <>
          <h2>Edit Post</h2>
          <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor="postBody">Post:</label>
            <textarea
              id="postBody"
              required
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            ></textarea>
            <button type="submit" onClick={() => handleEdit(post.id)}>
              Submit
            </button>
          </form>
        </>
      )}
      {!editTitle && (
        <>
          <p>Post not found!</p>
          <p>
            <Link to="/"> Visit Our Homepage</Link>
          </p>
        </>
      )}
    </main>
  );
};

export default EditPost;
