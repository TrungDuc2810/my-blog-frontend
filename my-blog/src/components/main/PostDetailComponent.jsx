// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "../../services/PostService";
import { getMediaByPostId } from "../../services/MediaService";
import { getCategoryById } from "../../services/CategoryService";
import { getCommentsByPostId } from "../../services/CommentService";
import { getPostsByCategoryId } from "../../services/PostService";
import { createComment } from "../../services/CommentService";
import PageTransition from './PageTransition';

const PostDetailComponent = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); 
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const fetchPostDetails = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);

        const mediaData = await getMediaByPostId(postId);
        setThumbnail(mediaData.data.filePath);

        const commentData = await getCommentsByPostId(postId);
        setComments(commentData);

        if (postData.categoryId) {
          const categoryData = await getCategoryById(postData.categoryId);
          setCategoryName(categoryData.data.name);

          const relatedPostsData = await getPostsByCategoryId(
            postData.categoryId,
            currentPage,
            postsPerPage,
            "postedAt",
            "asc"
          );

          setRelatedPosts(relatedPostsData.data.content);
          setTotalPages(relatedPostsData.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, currentPage]); // Gọi lại API khi trang thay đổi

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handlePostComment = async (event) => {
    event.preventDefault(); // Ngăn chặn reload trang

    if (!commentText.trim()) return; // Không gửi nếu bình luận rỗng

    try {
      const newComment = {
        postId: postId,
        name: "Anonymous",
        email: "anonymous2810@example.com",
        body: commentText,
      };

      // Gửi bình luận lên server và load lại danh sách bình luận mà không load lại cả trang
      await createComment(postId, newComment);
      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments); // Cập nhật state với danh sách mới

      // Xóa nội dung trong ô input
      setCommentText("");
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) { 
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date); // Chuẩn hóa AM/PM thành a.m./p.m.

    return `${formattedDate} at ${formattedTime
      .replace("AM", "A.M")
      .replace("PM", "P.M")}`;
  };

  return (
    <PageTransition>
      <div className="content-wrapper">
        <div className="post__detail">
          {post ? (
            <>
              <div className="post__detail-header">
                <div className="post__detail-thumbnail">
                  <img src={thumbnail} alt={post.title} />
                </div>
                <div className="post__detail-info">
                  <h1 className="post__detail-title">{post.title}</h1>
                  <span className="post__detail-meta">
                    by Nguyen Trung Duc in <Link to={"/"}>{categoryName}</Link>
                  </span>
                  <span className="post__detail-date">
                    {formatDate(post.postedAt)}
                  </span>
                  <div className="post__detail-link">
                    <i className="fa-solid fa-link"></i>
                    <span>Copy</span>
                  </div>
                </div>
              </div>
              <div
                className="post__detail-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
              <div className="related__posts">
                <p className="related__posts-title">Related Posts</p>
                <div className="related__posts-list">
                  <button
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                  >
                    <i className="fa-solid fa-angle-left fa-lg"></i>
                  </button>
                  <div className="related__posts-wrapper">
                    {relatedPosts.map((relatedPost) => (     
                      <div key={relatedPost.id} className="related__post">
                        <Link to={`/posts/${relatedPost.id}`} className="link">
                          <div className="related__post-info">
                            <h5 className="related__post-title">
                              {relatedPost.title}
                            </h5>
                            <span className="related__post-author">
                              by Nguyen Trung Duc
                            </span>
                            <p className="related__post-date">
                              {formatDate(relatedPost.postedAt)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <i className="fa-solid fa-angle-right fa-lg"></i>
                  </button>
                </div>
              </div>

              <div className="post__comments">
                <p className="post__comments-title">Comments</p>
                {comments.map((comment) => (
                  <div key={comment.id} className="post__comment">
                    <img
                      className="post__comment-avt"
                      src={comment.avatar}
                      alt={comment.name}
                    />
                    <div className="post__comment-info">
                      <span className="post__comment-username">
                        {comment.name}
                      </span>
                      <span className="post__comment-content">
                        {comment.body}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="post__comment-box">
                  <img
                    className="post__comment-avt"
                    src="/img/leo.jpg"
                    alt="Leo"
                  />
                  <div className="post__comment-form">
                    <input
                      className="post__comment-input"
                      type="text"
                      placeholder="Let's write your comment..."
                      value={commentText}
                      onChange={handleCommentChange}
                    />
                    <button
                      className="post__comment-btn"
                      disabled={!commentText.trim()}
                      onClick={handlePostComment}
                      style={{
                        backgroundColor: commentText.trim() ? "pink" : "#ccc",
                      }}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Oops...Something wrong!!!</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PostDetailComponent;
