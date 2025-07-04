// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { deletePost, getAllPosts, updatePost } from "../../services/PostService";
import { getAllCategories } from "../../services/CategoryService";
import RichTextEditor from "./RichTextEditor";

const ListPostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [categories, setCategories] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState({});
  const [editorMode, setEditorMode] = useState(""); // "create" or "update"

  useEffect(() => {
    listPosts(pageNo);
    loadCategoriesName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  const listPosts = (pageNo) => {
    getAllPosts(pageNo, pageSize, "id", "asc")
      .then((res) => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => console.error(error));
  };

  const loadCategoriesName = () => {
    getAllCategories()
      .then((res) => {
        const categoryMap = res.data.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategories(categoryMap);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId)); // Bỏ chọn
    } else {
      setSelectedPosts([...selectedPosts, postId]); // Chọn
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedPosts.length > 0) {
      setSelectedPosts([]); // Bỏ chọn tất cả
    }
  };

  const handleRowClick = (postId) => {
    handleSelectPost(postId);
  };

  const handlePaginationClick = (newPageNo) => {
    setPageNo(newPageNo);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pageNo - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages);

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDelete = () => {
    if (selectedPosts.length === 1) {
      deletePost(selectedPosts[0])
        .then(() => {
          listPosts(pageNo);
          setSelectedPosts([]);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Sure to delete all users selected?")) {
      try {
        await Promise.all(selectedPosts.map((userId) => deletePost(userId)));
        setSelectedPosts([]); // Xóa tất cả các lựa chọn
        listPosts(pageNo); // Làm mới danh sách người dùng sau khi xóa
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdate = () => {
    if (selectedPosts.length === 1) {
      const selectedPost = posts.find((post) => post.id === selectedPosts[0]);
      setPostToUpdate(selectedPost);
      setEditorMode("update"); // Chế độ cập nhật
      setShowEditor(true); // Dùng RichTextEditor để cập nhật
    }
  };

  const handleUpdateSubmit = () => {
    updatePost(postToUpdate.id, postToUpdate)
      .then(() => {
        listPosts(pageNo);
        setShowUpdateModal(false);
        setSelectedPosts([]);
      })
      .catch((error) => console.error(error));
  };

  // Xử lý mở trình soạn thảo khi nhấn "Create"
  const handleOpenEditor = () => {
    setPostToUpdate({}); // Đặt lại postToUpdate để tạo bài viết mới
    setEditorMode("create"); // Chế độ tạo mới
    setShowEditor(true);
  };

  // Xử lý đóng trình soạn thảo
  const handleCancelEditor = () => {
    setShowEditor(false);
  };

  const handleSavePost = () => {
    setShowEditor(false); // Đóng editor sau khi lưu
    if (editorMode === "update") {
      alert("Post updated successfully!"); // Cập nhật bài viết
    } else {
      alert("Publish successful!!!"); // Tạo mới bài viết
    }
    listPosts(pageNo); // Cập nhật danh sách bài viết
  };

  return (
    <div className="content">
      <div className="row mt-5">
        <div className="container">
          <div className="table-title text-center fw-bold">POSTS TABLE</div>
          <div className="table">
            <thead>
              <tr>
                <th className="col-1">
                  <input
                    type="checkbox"
                    onChange={handleToggleSelectAll}
                    disabled={!selectedPosts.length}
                    checked={selectedPosts.length > 0}
                    className="custom-checkbox"
                  />
                </th>
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
                <tr
                  key={post.id}
                  className={selectedPosts.includes(post.id) ? "bold-row" : ""}
                  onClick={() => handleRowClick(post.id)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="custom-checkbox"
                    />
                  </td>
                  <td className="text-truncate">{post.id}</td>
                  <td className="text-truncate">{post.title}</td>
                  <td className="text-truncate">{post.content}</td>
                  <td className="text-truncate">{post.description}</td>
                  <td className="text-truncate">
                    {categories[post.categoryId]}
                  </td>
                  <td className="text-truncate">{post.postedAt}</td>
                  <td className="text-truncate">{post.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="pagination-container d-flex align-items-center">
          <ul className="pagination">
            <li className={`page-item ${pageNo === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePaginationClick(0)}
              >
                &lt;&lt;
              </button>
            </li>
            <li className={`page-item ${pageNo === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePaginationClick(pageNo - 1)}
              >
                &lt;
              </button>
            </li>
            {getVisiblePages().map((page) => (
              <li
                key={page}
                className={`page-item ${pageNo === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePaginationClick(page)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                pageNo === totalPages - 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePaginationClick(pageNo + 1)}
              >
                &gt;
              </button>
            </li>
            <li
              className={`page-item ${
                pageNo === totalPages - 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePaginationClick(totalPages - 1)}
              >
                &gt;&gt;
              </button>
            </li>
          </ul>
        </div>

        <div>
          <button
            className="btn btn-primary ms-2 mb-2"
            onClick={handleOpenEditor}
          >
            Create
          </button>
          {showEditor && (
            <div className="modal-overlay-editor">
              <div className="modal-content-editor">
                <RichTextEditor
                  onSave={handleSavePost}
                  onCancel={handleCancelEditor}
                  initialPost={postToUpdate} // Truyền bài viết cần cập nhật
                  mode={editorMode} // Chế độ "create" hoặc "update"
                />
              </div>
            </div>
          )}
          <button
            className={`btn btn-primary ${
              selectedPosts.length === 1 ? "" : "disabled"
            } ms-2 mb-2`}
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className={`btn btn-danger ${
              selectedPosts.length === 1 ? "" : "disabled"
            } ms-2 mb-2`}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className={`btn btn-danger ${
              selectedPosts.length > 0 ? "" : "disabled"
            } ms-2 mb-2`}
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        </div>
      </div>

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="text-center">Update Post</h4>
            <form>
              <div className="mb-3">
                <label>Title</label>
                <input
                  type="text"
                  value={postToUpdate.title || ""}
                  onChange={(e) =>
                    setPostToUpdate({ ...postToUpdate, title: e.target.value })
                  }
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Content</label>
                <textarea
                  value={postToUpdate.content || ""}
                  onChange={(e) =>
                    setPostToUpdate({
                      ...postToUpdate,
                      content: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  value={postToUpdate.description || ""}
                  onChange={(e) =>
                    setPostToUpdate({
                      ...postToUpdate,
                      description: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Categories</label>
                <select
                  value={postToUpdate.categoryId || ""}
                  onChange={(e) =>
                    setPostToUpdate({
                      ...postToUpdate,
                      categoryId: e.target.value,
                    })
                  }
                  className="form-control"
                >
                  {Object.entries(categories).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateSubmit}
                >
                  Update
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPostComponent;
