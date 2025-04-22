import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, getPostsByCategoryId, searchPostsByTitle } from "../../services/PostService";
import { getAllCategories } from "../../services/CategoryService";
import { getMediaByPostId } from "../../services/MediaService";
import { useSearch } from "../../hooks/useSearch";
import PageTransition from './PageTransition';

const UserHomeComponent = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    listPosts();
    listCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      fetchSearchResults(searchTerm);
    }
  }, [searchTerm, posts]);

  const fetchSearchResults = (title) => {
    searchPostsByTitle(title, 0, 100, "id", "desc")
      .then((response) => {
        setFilteredPosts(response.data.content);
      })
      .catch((error) => console.error("Error searching posts:", error));
  };

  function listPosts() {
    getAllPosts(0, 100, "id", "asc")
      .then((response) => {
        setPosts(response.data.content);
        setFilteredPosts(response.data.content);
        response.data.content.forEach((post) => getThumbnail(post.id));
      })
      .catch((error) => console.error(error));
  }

  function listCategories() {
    getAllCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error));
  }

  function getThumbnail(postId) {
    getMediaByPostId(postId)
      .then((response) =>
        setThumbnails((prevThumbnail) => ({
          ...prevThumbnail,
          [postId]: response.data.filePath,
        }))
      )
      .catch((error) => console.error(error));
  }

  function handleCategoryClick(categoryId) {
    getPostsByCategoryId(categoryId, 0, 100, "postedAt", "desc")
      .then((response) => {
        setPosts(response.data.content);
        setFilteredPosts(response.data.content);
      })
      .catch((error) => console.error(error));
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <PageTransition>
      <div className="content-wrapper">
        <div className="blog">
          <div className="blog__intro">Welcome to the Cuddy&apos;s blog :D</div>
          <div className="blog__content">
            <div className="blog__posts">
              {filteredPosts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="blog__post">
                    <Link to={`/posts/${post.id}`} className="link">
                      <div>
                        <img
                          className="blog__post-thumbnail"
                          src={thumbnails[post.id]}
                          alt={post.title}
                        />
                      </div>
                      <div className="blog__post-info">
                        <p className="blog__post-date">{formatDate(post.postedAt)}</p>
                        <h2 className="blog__post-title">{post.title}</h2>
                        <p
                          className="blog__post-content"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="blog__categories">
              <span>All Categories</span>
              {categories.map((category) => (
                <a
                  key={category.id}
                  className="blog__category"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserHomeComponent;
