// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { deleteUserById, getAllUsers } from "../../services/UserService";
// import { isAdminUser } from "../services/AuthService";

const ListUserComponent = () => {
  const [users, setUsers] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // const isAdmin = isAdminUser();

  useEffect(() => {
    listUsers(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  function listUsers(pageNo) {
    getAllUsers(pageNo, pageSize, "id", "asc")
      .then((res) => {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleSelectUser = (userId, roles) => {
    // Kiểm tra nếu user có vai trò "ROLE_ADMIN", không cho phép chọn
    if (roles.some((role) => role.name === "ROLE_ADMIN")) {
      return;
    }
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleToggleSelectAll = () => {
    setSelectedUsers([]); // Bỏ chọn tất cả
  };

  const handleRowClick = (userId, roles) => {
    handleSelectUser(userId, roles);
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
    if (selectedUsers.length === 1) {
      deleteUserById(selectedUsers[0])
        .then(() => {
          listUsers(pageNo);
          setSelectedUsers([]);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Sure to delete all users selected?")) {
      try {
        await Promise.all(selectedUsers.map((userId) => deleteUserById(userId)));
        setSelectedUsers([]); // Xóa tất cả các lựa chọn
        listUsers(pageNo); // Làm mới danh sách người dùng sau khi xóa
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  return (
    <div className="content">
      <div className="row mt-5">
        <div className="container">
          <div className="table-title text-center fw-bold">USERS TABLE</div>
          <div className="table">
            <thead>
              <tr>
                <th className="col-1">
                  <input
                    type="checkbox"
                    onChange={handleToggleSelectAll}
                    disabled={!selectedUsers.length}
                    checked={selectedUsers.length > 0}
                    className="custom-checkbox"
                  />
                </th>
                <th className="col-1">ID</th>
                <th className="col-2">Name</th>
                <th className="col-2">Username</th>
                <th className="col-2">Email</th>
                <th className="col-1">Roles</th>
                <th className="col-2">Registered at</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={selectedUsers.includes(user.id) ? "bold-row" : ""}
                  onClick={() => handleRowClick(user.id, user.roles)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id, user.roles)}
                      className="custom-checkbox"
                      disabled={user.roles.some(
                        (role) => role.name === "ROLE_ADMIN"
                      )}
                    />
                  </td>
                  <td className="text-truncate">{user.id}</td>
                  <td className="text-truncate">
                    <div className="d-flex align-items-center avt-img">
                      <img
                        src="/default.png"
                        className="rounded-circle"
                        alt="avatar"
                      />
                      <div className="ms-3 mt-1">
                        <p className="text-truncate fw-bold mb-1">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-truncate">{user.username}</td>
                  <td className="text-truncate mb-1">{user.email}</td>
                  <td className="text-truncate mb-1">
                    {user.roles.map((role) => role.name).join(", ")}
                  </td>
                  <td className="text-truncate">{user.registeredAt}</td>
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
            className={`btn btn-danger ${
              selectedUsers.length === 1 ? "" : "disabled"
            } ms-2 mb-2`}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className={`btn btn-danger ${
              selectedUsers.length > 0 ? "" : "disabled"
            } ms-2 mb-2`}
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};
export default ListUserComponent;
