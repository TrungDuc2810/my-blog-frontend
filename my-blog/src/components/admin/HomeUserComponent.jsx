// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";

const HomeUserComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    listUsers();
  }, []);

  function listUsers() {
    getAllUsers(0, 9, "id", "asc")
      .then((res) => {
        setUsers(res.data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <div className="table-title text-center fw-bold">USERS TABLE</div>
      <div className="table">
        <thead>
          <tr>
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
            <tr key={user.id}>
              <th scope="row">{user.id}</th>
              <td className="text-truncate">
                <div className="d-flex align-items-center avt-img">
                  <img
                    src="/default.png"
                    className="rounded-circle"
                    alt="avatar"
                  />
                  <div className="ms-3 mt-1 text-truncate">
                    <p className="fw-bold mb-1">{user.name}</p>
                  </div>
                </div>
              </td>
              <td className="text-truncate">{user.username}</td>
              <td className="text-truncate fw-normal mb-1">{user.email}</td>
              <td className="text-truncate fw-normal mb-1">
                {user.roles.map((role) => role.name).join(", ")}
              </td>
              <td className="text-truncate">{user.registeredAt}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
};

export default HomeUserComponent;
