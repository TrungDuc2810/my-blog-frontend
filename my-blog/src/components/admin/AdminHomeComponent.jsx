// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { getTotalPosts } from "../../services/PostService";
import { getTotalUsers } from "../../services/UserService";
import { getTotalMedia } from "../../services/MediaService";
import HomePostComponent from "./HomePostComponent";
import HomeUserComponent from "./HomeUserComponent";

const HomeComponent = () => {
  const items = [
    { iconClass: "fa-solid fa-newspaper", label: "Total Posts", fetchCount: getTotalPosts },
    { iconClass: "fa-solid fa-users", label: "Total Users", fetchCount: getTotalUsers },
    { iconClass: "fa-solid fa-photo-film", label: "Total Media", fetchCount: getTotalMedia },
  ];

  const [totalCols, setTotalCols] = useState(
    items.map((item) => ({ ...item, count: 0 }))
  );

  useEffect(() => {
    fetchCounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCounts = async () => {
    try {
      const updatedCounts = await Promise.all(
        items.map(async (item) => {
          try {
            const res = await item.fetchCount();
            return { ...item, count: res.data };
          } catch (error) {
            console.error(`Error fetching count for ${item.label}:`, error);
            return item;
          }
        })
      );
      setTotalCols(updatedCounts);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  return (
    <div className="content">
      <div className="mt-3">
        <div className="d-flex text-center">
          {totalCols.map((col, index) => (
            <div
              key={index}
              className={`flex-fill total-col ${index === 1 ? "me-4 ms-4" : ""}`}
            >
              <div className="total-content">
                <i className={`${col.iconClass} fa-3x`}></i>
                <span className="fs-5">{col.label}</span>
                <p className="fs-3 fw-bold">{col.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="row mt-5">
          <HomePostComponent />
        </div>
        <div className="row mt-5 mb-0">
          <HomeUserComponent />
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
