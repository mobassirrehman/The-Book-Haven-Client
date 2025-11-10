import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} - The Book Haven`;
  }, [title]);
};

export default useTitle;