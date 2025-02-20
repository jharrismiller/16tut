import React from "react";
import Feed from "./Feed";

const Home = ({ posts, fetchError, isLoading }) => {
  return (
    <main className="Home">
      {isLoading && <p className="statusMsg">Loading Posts...</p>}
      {!isLoading && fetchError && (
        <p className="statusMsg" style={{ color: "red" }}>
          {fetchError}
        </p>
      )}
      {!fetchError &&
        !isLoading &&
        (posts.length ? (
          <Feed posts={posts} />
        ) : (
          <p className='statusMsg'>No posts yet!</p>
        ))}
    </main>
  );
};

export default Home;
