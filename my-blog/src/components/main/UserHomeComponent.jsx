import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllPosts,
  getPostsByCategoryId,
  searchPostsByTitle,
} from "../../services/PostService";
import { getAllCategories } from "../../services/CategoryService";
import { getMediaByPostId } from "../../services/MediaService";
import { useSearch } from "../../hooks/useSearch";
import PageTransition from "./PageTransition";
import ScrollToTopButton from "../common/ScrollToTopButton";

const UserHomeComponent = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { searchTerm } = useSearch();

  useEffect(() => {
    setPage(0);
    listPosts(0);
    listCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(0);
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      fetchSearchResults(searchTerm, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, posts]);

  const fetchSearchResults = (title, pageNum = 0) => {
    searchPostsByTitle(title, pageNum, 10, "id", "asc")
      .then((response) => {
        if (pageNum === 0) {
          setFilteredPosts(response.data.content);
        } else {
          setFilteredPosts((prev) => [...prev, ...response.data.content]);
        }
        response.data.content.forEach((post) => getThumbnail(post.id));
        setHasMore(!response.data.last && response.data.content.length > 0);
      })
      .catch((error) => console.error("Error searching posts:", error));
  };

  function listPosts(pageNum = 0) {
    setLoading(true);
    getAllPosts(pageNum, 10, "id", "asc")
      .then((response) => {
        const newPosts = response.data.content;
        if (pageNum === 0) {
          setPosts(newPosts);
          setFilteredPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
          setFilteredPosts((prev) => [...prev, ...newPosts]);
        }
        newPosts.forEach((post) => getThumbnail(post.id));
        setHasMore(!response.data.last && newPosts.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
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
    setSelectedCategory(categoryId);
    setPage(0);
    getPostsByCategoryId(categoryId, 0, 10, "postedAt", "asc")
      .then((response) => {
        setFilteredPosts(response.data.content);
        setHasMore(!response.data.last && response.data.content.length > 0);
        response.data.content.forEach((post) => getThumbnail(post.id));
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
                        <p className="blog__post-date">
                          {formatDate(post.postedAt)}
                        </p>
                        <div className="blog__post-views">
                          <i className="fa-solid fa-eye"></i>
                          <span>{post.views}</span>
                        </div>
                        <h2 className="blog__post-title">{post.title}</h2>
                        <p
                          className="blog__post-content"
                          dangerouslySetInnerHTML={{ __html: post.description }}
                        />
                      </div>
                    </Link>
                  </div>
                ))
              )}
              <div className="blog__posts-btn-wrapper">
                {hasMore && (
                  <button
                    className="blog__posts-btn"
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      if (searchTerm.trim() !== "") {
                        fetchSearchResults(searchTerm, nextPage);
                      } else if (selectedCategory) {
                        getPostsByCategoryId(
                          selectedCategory,
                          nextPage,
                          10,
                          "postedAt",
                          "asc"
                        )
                          .then((response) => {
                            setFilteredPosts((prev) => [
                              ...prev,
                              ...response.data.content,
                            ]);
                            setHasMore(
                              !response.data.last &&
                                response.data.content.length > 0
                            );
                            response.data.content.forEach((post) =>
                              getThumbnail(post.id)
                            );
                          })
                          .catch((error) => console.error(error));
                      } else {
                        listPosts(nextPage);
                      }
                    }}
                    disabled={loading}
                  >
                    <span>{loading ? "Loading..." : "Load more"}</span>
                  </button>
                )}
              </div>
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
        <ScrollToTopButton showBelow={300} />
      </div>
    </PageTransition>
  );
};

export default UserHomeComponent;
