import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/posts";
import useWindowSize from "../hooks/useWindowSize"; // import the custom hook
import useAxiosFetch from "../hooks/useAxiosFetch";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate();
  const { width } = useWindowSize(); // use the custom hook

  const { data, fetchError, isLoading } = useAxiosFetch(
    "http://localhost:3500/posts"
  );

  useEffect(() => {
    setPosts(data);
  }, [data]); // add data as a dependency

  useEffect(() => {
    const results = posts.filter((post) => {
      if (!search) return true;
      let searchLower = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.body.toLowerCase().includes(searchLower)
      );
    });
    setSearchResults(results.reverse());
  }, [posts, search]);

  const handleEdit = async (id) => {
    try {
      const response = await api.put(`/posts/${id}`, {
        id: id,
        title: editTitle,
        body: editBody,
        datetime: format(new Date(), "MMMM dd, yyyy pp"),
      });

      setEditTitle("");
      setEditBody("");

      const updatedPosts = posts.map((post) =>
        post.id === id ? { ...response.data } : post
      );

      setPosts(updatedPosts);

      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = (
      posts.length ? parseInt(posts[posts.length - 1].id) + 1 : 1
    ).toString();

    const newPost = {
      id: id,
      title: postTitle,
      datetime: format(new Date(), "MMMM dd, yyyy pp"),
      body: postBody,
    };
    try {
      const response = await api.post("/posts", newPost);
      setPosts([...posts, response.data]);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        width,
        search,
        setSearch,
        searchResults,
        posts,
        setPosts,
        postTitle,
        setPostTitle,
        postBody,
        setPostBody,
        editTitle,
        setEditTitle,
        editBody,
        setEditBody,
        navigate,
        handleEdit,
        handleDelete,
        handleSubmit,
        fetchError,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
