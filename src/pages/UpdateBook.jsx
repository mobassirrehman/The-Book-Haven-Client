import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useTitle from "../hooks/useTitle";
import toast from "react-hot-toast";
import gsap from "gsap";
import axios from "axios";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LuLink } from "react-icons/lu";
import { IoIosCloudDone } from "react-icons/io";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useTitle("Update Book");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setImageUrl(response.data.coverImage);
        setImagePreview(response.data.coverImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to load book");
        navigate("/all-books");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && book) {
      const ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });

        gsap.from(titleRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
        });

        gsap.fromTo(
          formRef.current.children,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.5,
          }
        );
      }, cardRef);

      return () => ctx.revert();
    }
  }, [loading, book]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );

      if (response.data.success) {
        setImageUrl(response.data.data.url);
        setUploading(false);
        toast.success("Image uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploading(false);
      setImagePreview(book.coverImage);
      toast.error("Upload failed. Try URL option.");
      console.error(error);
    }
  };

  const validateImageUrl = (url) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    try {
      const urlObj = new URL(url);
      return imageExtensions.test(urlObj.pathname);
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.trim();
    setImageUrl(url);

    if (url && validateImageUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(book?.coverImage || "");
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const author = e.target.author.value.trim();
    const genre = e.target.genre.value;
    const rating = parseFloat(e.target.rating.value);
    const summary = e.target.summary.value.trim();

    if (!imageUrl) {
      toast.error("Please provide a cover image");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const updatedBook = {
      title,
      author,
      genre,
      rating,
      summary,
      coverImage: imageUrl,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/books/${id}`,
        updatedBook
      );

      if (response.data.modifiedCount > 0) {
        toast.success("Book updated successfully!");
        navigate(`/book/${id}`);
      } else {
        toast.info("No changes were made");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update book. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="form-card">
          <SkeletonLoader type="form" />
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div ref={cardRef} className="form-card">
        <h1 ref={titleRef} className="form-title">
          Update Book
        </h1>

        <form ref={formRef} onSubmit={handleUpdateBook}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                name="title"
                defaultValue={book.title}
                className="form-input"
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                name="author"
                defaultValue={book.author}
                className="form-input"
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                name="genre"
                defaultValue={book.genre}
                className="select-input"
                required
              >
                <option value="">Select genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Romance">Romance</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Poetry">Poetry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                defaultValue={book.rating}
                className="form-input"
                placeholder="4.5"
                min="1"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group form-full">
              <label className="form-label">Summary</label>
              <textarea
                name="summary"
                defaultValue={book.summary}
                className="textarea-input"
                placeholder="Enter description"
                required
              ></textarea>
            </div>

            <div className="form-group form-full">
              <label className="form-label">Cover Image</label>

              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 py-2 px-4 items-center justify-center flex rounded-lg font-semibold transition-all ${
                    uploadMethod === "file"
                      ? "bg-[#2C7873] text-white"
                      : "bg-[#F5F0E8] text-[#6B6B6B]"
                  }`}
                >
                  <FaCloudUploadAlt className="mr-2" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("url")}
                  className={`flex-1 py-2 px-4 items-center flex justify-center rounded-lg font-semibold transition-all ${
                    uploadMethod === "url"
                      ? "bg-[#2C7873] text-white"
                      : "bg-[#F5F0E8] text-[#6B6B6B]"
                  }`}
                >
                  <LuLink className="size-5 mr-2" /> URL
                </button>
              </div>

              {uploadMethod === "file" && (
                <div className="file-upload-wrapper">
                  <label htmlFor="coverImage" className="file-upload-label">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {uploading ? (
                      "Uploading..."
                    ) : imageUrl ? (
                      <span className="flex items-center gap-2">
                        <IoIosCloudDone className="text-xl" />
                        Uploaded
                      </span>
                    ) : (
                      "Choose Image"
                    )}
                  </label>
                  <input
                    type="file"
                    id="coverImage"
                    className="file-upload-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>
              )}

              {uploadMethod === "url" && (
                <div>
                  <input
                    type="url"
                    value={imageUrl}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    onChange={handleUrlChange}
                  />
                  {imageUrl &&
                    !validateImageUrl(imageUrl) &&
                    imageUrl.length > 10 && (
                      <p className="error-message">
                        Please enter a valid image URL (.jpg, .png, .gif, etc.)
                      </p>
                    )}
                </div>
              )}
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    onError={() => {
                      setImagePreview("");
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit mt-8"
            disabled={uploading}
          >
            {uploading ? "Please wait..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;