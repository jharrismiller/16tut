import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, set } from "date-fns";
import api from "./api/posts";
import EditPost from "./EditPost";
import useWindowSize from "./hooks/useWindowSize"; // import the custom hook

function App() {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate();
  const { width } = useWindowSize(); // use the custom hook

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //axios get returns json and checks repsonse ok and throws error
        const response = await api.get("/posts");
        console.log("GET");
        setPosts(response.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else console.log(`Error: ${error.message}`);
      }
    };
    fetchPosts();
  }, []);

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

      setPosts((await api.get("/posts")).data);

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

  return (
    <div className="App">
      <Header title="React JS Blog" width={width} />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route exact path="/" element={<Home posts={searchResults} />} />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <EditPost
              handleEdit={handleEdit}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}
              posts={posts}
            />
          }
        />
        <Route
          path="/post/:id"
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path="/about" element={<About />}></Route>
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
