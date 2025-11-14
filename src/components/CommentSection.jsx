import { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const CommentSection = ({ bookId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/comments/${bookId}`
        );
        setComments(data);
      } catch {
          console.error("Error fetching comments");
      }
    };

    fetchComments();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        bookId,
        userName: user.displayName,
        userPhoto: user.photoURL,
        userEmail: user.email,
        comment: newComment,
      };

      const { data } = await axios.post(
        "http://localhost:3000/comments",
        commentData
      );
      setComments([data, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId, commentUserEmail) => {
    if (user.email !== commentUserEmail) {
      toast.error("You can only delete your own comments");
      return;
    }

    if (deleteId !== commentId) {
      setDeleteId(commentId);
      toast("Click delete again to confirm", { icon: "⚠️" });
      setTimeout(() => setDeleteId(null), 3000);
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-[#3D3229] mb-6">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#2C7873]"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 bg-[#F5F0E8] border-2 border-[#6B5D52]/30 rounded-lg focus:outline-none focus:border-[#2C7873] resize-none"
                rows="3"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-[#6B6B6B] mb-8">Please login to comment</p>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-[#6B6B6B]">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-4 p-4 bg-[#F5F0E8] rounded-lg relative"
            >
              <img
                src={comment.userPhoto}
                alt={comment.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-[#3D3229]">
                    {comment.userName}
                  </h4>
                  <span className="text-xs text-[#6B6B6B]">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-[#3D3229]">{comment.comment}</p>
              </div>

              {user && user.email === comment.userEmail && (
                <button
                  onClick={() => handleDelete(comment._id, comment.userEmail)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete comment"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
