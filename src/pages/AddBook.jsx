import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { LuLink } from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";

const AddBook = () => {
  useTitle("Add Book");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
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
  }, []);

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
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        setUploading(false);
        toast.success("Image uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploading(false);
      setImagePreview("");
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
      setImagePreview("");
    }
  };

  const handleAddBook = (e) => {
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

    const newBook = {
      title,
      author,
      genre,
      rating,
      summary,
      coverImage: imageUrl,
      userEmail: user?.email,
      userName: user?.displayName,
      addedAt: new Date().toISOString(),
    };

    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.insertedId) {
          toast.success("Book added successfully!");
          navigate("/all-books");
        } else {
          throw new Error("No insertedId received");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to add book. Please try again.");
      });
  };

  return (
    <div className="form-container">
      <div ref={cardRef} className="form-card">
        <h1 ref={titleRef} className="form-title">
          Add a New Book
        </h1>

        <form ref={formRef} onSubmit={handleAddBook}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                name="title"
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
                className="form-input"
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <select name="genre" className="select-input" required>
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
            {uploading ? "Please wait..." : "Add Book to Library"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
