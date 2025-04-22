// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { getAllPosts } from "../../services/PostService";

const HomePostComponent = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    listPosts();
  }, []);

  function listPosts() {
    getAllPosts(0, 9, "id", "asc")
      .then((response) => setPosts(response.data.content))
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <div className="table-title text-center fw-bold">POSTS TABLE</div>
      <div className="table">
        <thead>
          <tr>
            <th className="col-1">ID</th>
            <th className="col-3">Title</th>
            <th className="col-3">Content</th>
            <th className="col-3">Description</th>
            <th className="col-1">Categories</th>
            <th className="col-1">Posted at</th>
            <th className="col-1">Last update</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="text-truncate">{post.id}</td>
              <td className="text-truncate">{post.title}</td>
              <td className="text-truncate">{post.content}</td>
              <td className="text-truncate">{post.description}</td>
              <td className="text-truncate">{post.categoryId}</td>
              <td className="text-truncate">{post.postedAt}</td>
              <td className="text-truncate">{post.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
};

export default HomePostComponent;
