import React from "react";
import Feed from "./Feed";
import { useContext } from "react";
import  DataContext from "./context/DataContext";


const Home = () => {

  const { searchResults,  fetchError,   isLoading } = useContext(DataContext);

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
        (searchResults.length ? (
          <Feed posts={searchResults} />
        ) : (
          <p className='statusMsg'>No posts yet!</p>
        ))}
    </main>
  );
};

export default Home;
