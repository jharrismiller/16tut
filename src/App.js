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
import { format } from "date-fns";
import api from "./api/posts";

function App() {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //axios get returns json and checks repsonse ok and throws error
        const response = await api.get("/posts");
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

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;

    const newPost = {
      id: id,
      title: postTitle,
      datetime: format(new Date(), "MMMM dd, yyyy pp"),
      body: postBody,
    };

    setPosts([...posts, newPost]);
    setPostTitle("");
    setPostBody("");
    navigate("/");
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
      <Header title="React JS Blog" />
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
