import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import useTitle from "../../hooks/useTitle";
import toast from "react-hot-toast";
import axios from "axios";
import { gsap } from "gsap";
import {
  IoCloudUpload,
  IoCheckmarkCircle,
  IoSaveOutline,
  IoArrowBack,
} from "react-icons/io5";

const DashboardUpdateBook = () => {
  useTitle("Update Book");
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [useUrl, setUseUrl] = useState(true);
  const formRef = useRef(null);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Romance",
    "Science Fiction",
    "Biography",
    "History",
    "Self-Help",
    "Poetry",
    "Thriller",
    "Horror",
  ];

  useEffect(() => {
    axios
      .get(`https://book-haven-server-neon.vercel.app/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setImagePreview(response.data.coverImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (formRef.current && !loading) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [loading]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      setImagePreview(response.data.data.display_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUrlChange = (e) => {
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const form = e.target;
    const updatedBook = {
      title: form.title.value,
      author: form.author.value,
      genre: form.genre.value,
      rating: parseFloat(form.rating.value),
      summary: form.summary.value,
      coverImage: imagePreview,
    };

    if (!updatedBook.coverImage) {
      toast.error("Please add a cover image");
      setUpdating(false);
      return;
    }

    try {
      const response = await axios.put(
        `https://book-haven-server-neon.vercel.app/books/${id}`,
        updatedBook
      );
      if (response.data.modifiedCount > 0) {
        toast.success("Book updated successfully!");
        navigate("/dashboard/my-books");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="skeleton h-12 w-48 mb-4 rounded-lg"></div>
        <div className="skeleton h-[600px] rounded-2xl"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--color-text-secondary)]">Book not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4 transition-colors"
        >
          <IoArrowBack />
          Back
        </button>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-[Cormorant_Garamond]">
          Update Book
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Edit "{book.title}" details
        </p>
      </div>

      <div
        ref={formRef}
        className="p-6 md:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Cover Image</label>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUseUrl(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  !useUrl
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                }`}
              >
                Upload New
              </button>
              <button
                type="button"
                onClick={() => setUseUrl(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  useUrl
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                }`}
              >
                Use URL
              </button>
            </div>

            {useUrl ? (
              <input
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                className="form-input"
                value={imagePreview}
                onChange={handleUrlChange}
              />
            ) : (
              <label className="file-upload-label cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin"></span>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <IoCloudUpload className="text-2xl" />
                    Click to upload new image
                  </span>
                )}
              </label>
            )}

            {imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-56 object-cover rounded-lg border-2 border-[var(--color-border)]"
                  onError={() => setImagePreview(book.coverImage)}
                />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <IoCheckmarkCircle className="text-white" />
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                defaultValue={book.title}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                name="author"
                className="form-input"
                defaultValue={book.author}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                name="genre"
                className="select-input"
                defaultValue={book.genre}
                required
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                className="form-input"
                defaultValue={book.rating}
                min="1"
                max="5"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <textarea
              name="summary"
              className="textarea-input"
              defaultValue={book.summary}
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={updating || uploadingImage}
            className="btn-primary w-full py-4"
          >
            {updating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              <>
                <IoSaveOutline className="text-xl" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardUpdateBook;
