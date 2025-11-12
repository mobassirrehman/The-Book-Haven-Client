import React from "react";
import SkeletonLoader from "../components/shared/SkeletonLoader";

const UpdateBook = ({ loading }) => {
  if (loading) {
    return (
      <div className="update-page">
        <div className="update-card">
          <SkeletonLoader type="form" />
        </div>
      </div>
    );
  }
};

export default UpdateBook;
