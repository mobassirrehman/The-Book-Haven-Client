const SkeletonLoader = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <div className="table-container">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton skeleton-table-row"></div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="flex gap-4">
              <div className="skeleton w-20 h-28 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton skeleton-text w-3/4"></div>
                <div className="skeleton skeleton-text w-1/2"></div>
                <div className="skeleton skeleton-text w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className="details-content">
        <div className="details-image-section">
          <div className="skeleton skeleton-image"></div>
        </div>
        <div className="details-info-section space-y-6">
          <div className="skeleton skeleton-text-lg w-3/4 mb-4"></div>
          <div className="skeleton skeleton-text w-1/2 mb-6"></div>
          <div className="skeleton skeleton-detail h-32"></div>
          <div className="skeleton skeleton-detail h-24"></div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="form-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="form-group">
            <div className="skeleton skeleton-text w-24 mb-2"></div>
            <div className="skeleton skeleton-text h-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="skeleton skeleton-table-row"></div>;
};

export default SkeletonLoader;
