import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import useTitle from "../../hooks/useTitle";
import toast from "react-hot-toast";
import {
  IoPersonCircle,
  IoCameraOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoCreateOutline,
  IoSaveOutline,
  IoCloseOutline,
} from "react-icons/io5";

const Profile = () => {
  useTitle("Profile");
  const { user, updateUserProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 font-[Cormorant_Garamond]">
          My Profile
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="profile-card">
        <div className="profile-banner">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
          <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/PkLY22P/library-9.jpg')] bg-cover bg-center opacity-20"></div>
        </div>

        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {isEditing && formData.photoURL ? (
              <img
                src={formData.photoURL}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
            ) : (
              <img
                src={user?.photoURL || "https://via.placeholder.com/120"}
                alt={user?.displayName}
                className="w-full h-full object-cover"
              />
            )}
            {isEditing && (
              <div className="profile-avatar-overlay">
                <IoCameraOutline className="text-2xl" />
              </div>
            )}
          </div>
          {!isEditing && (
            <span className="profile-verified-badge">
              <IoCheckmarkCircle className="text-lg" />
            </span>
          )}
        </div>

        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Photo URL</label>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Enter a direct link to your profile photo
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="form-input opacity-60 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <IoSaveOutline className="text-lg" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  <IoCloseOutline className="text-lg" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-[Cormorant_Garamond]">
                  {user?.displayName || "Book Lover"}
                </h2>
                <p className="text-[var(--color-text-muted)]">
                  Member of The Book Haven
                </p>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <IoMailOutline className="text-xl text-[var(--color-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Email
                    </p>
                    <p className="text-[var(--color-text-primary)] font-medium">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="profile-info-item">
                  <IoCalendarOutline className="text-xl text-[var(--color-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Member Since
                    </p>
                    <p className="text-[var(--color-text-primary)] font-medium">
                      {joinDate}
                    </p>
                  </div>
                </div>

                <div className="profile-info-item">
                  <IoPersonCircle className="text-xl text-[var(--color-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Account Status
                    </p>
                    <p className="text-green-600 font-medium flex items-center gap-1">
                      <IoCheckmarkCircle />
                      Verified
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary w-full mt-6"
              >
                <IoCreateOutline className="text-lg" />
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
          Account Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">
                Email Notifications
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Receive updates about new books and features
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
