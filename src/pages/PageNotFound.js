import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Page Not Found ☻</h1>
      <h3>
        Go to the Home Page: <Link to="/">Home Page</Link>
      </h3>
    </div>
  );
};

export default PageNotFound;
