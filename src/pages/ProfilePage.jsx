import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Camera } from "lucide-react";
import { toast } from "react-toastify";

import {
  getProfile,
  updateProfile,
  changePassword,
  clearMessages,
} from "../redux/slices/authSlice";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, isAuthenticated, loading, error, success } = useSelector(
    (state) => state.auth
  );

  const hasFetchedProfile = useRef(false);
  const isFetching = useRef(false);
  const hasInitialized = useRef(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    photoUrl: "",
    createdAt: "",
  });

  const [originalData, setOriginalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    photoUrl: "",
    createdAt: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !token && !hasInitialized.current) {
      toast.error("Please login to access your profile");
      navigate("/login", { state: { from: "/profile" } });
      hasInitialized.current = true;
    }
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    document.title = `My Profile - ${profileData.fullName || "User"} | Coffee Shop`;
  }, [profileData.fullName]);

  useEffect(() => {
    const fetchProfileOnce = async () => {
      if (hasFetchedProfile.current || isFetching.current || !token) {
        setIsPageLoading(false);
        return;
      }

      if (user && user.email) {
        setIsPageLoading(false);
        hasFetchedProfile.current = true;
        return;
      }

      isFetching.current = true;
      setIsPageLoading(true);

      try {
        console.log("Fetching profile...");
        await dispatch(getProfile()).unwrap();
        hasFetchedProfile.current = true;
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        if (error === "UNAUTHORIZED" || error === "No authentication token found") {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      } finally {
        setIsPageLoading(false);
        isFetching.current = false;
      }
    };

    fetchProfileOnce();

    return () => {
      isFetching.current = false;
    };
  }, [dispatch, token, user, navigate]);

  useEffect(() => {
    if (user) {
      const profileInfo = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        photoUrl: user.photoUrl || "",
        createdAt: user.createdAt || user.created_at || "",
      };

      const isDataChanged =
        JSON.stringify(profileInfo) !== JSON.stringify(originalData);

      if (isDataChanged) {
        console.log("Updating local profile data");
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
      }

      if (isPageLoading) {
        setIsPageLoading(false);
      }
    }
  }, [user, originalData, isPageLoading]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMessages());
    }

    if (error) {
      if (error !== "No authentication token found" && !isPageLoading) {
        toast.error(error);
      }
      dispatch(clearMessages());
    }
  }, [success, error, dispatch, isPageLoading]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    const hasChanges =
      profileData.fullName !== originalData.fullName ||
      profileData.phone !== originalData.phone ||
      profileData.address !== originalData.address ||
      selectedFile !== null;

    if (!hasChanges) {
      toast.info("No changes to save");
      setIsEditing(false);
      return;
    }

    try {
      console.log(profileData);
      console.log(selectedFile);
      await dispatch(
        updateProfile({
          fullName: profileData.fullName,
          phone: profileData.phone,
          address: profileData.address,
          photo: selectedFile,
        })
      ).unwrap();

      setIsEditing(false);
      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      hasFetchedProfile.current = false;
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.current || !newPassword.new || !newPassword.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.new.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword.new !== newPassword.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);

      await dispatch(
        changePassword({
          currentPassword: newPassword.current,
          newPassword: newPassword.new,
          confirmPassword: newPassword.confirm,
        })
      ).unwrap();

      setShowPasswordModal(false);
      setNewPassword({ current: "", new: "", confirm: "" });
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E6447]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-light mb-6 md:mb-12">
          Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {profileData.fullName || "User"}
              </h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                {profileData.email}
              </p>

              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mx-auto">
                  {previewUrl || profileData.photoUrl ? (
                    <img
                      src={previewUrl || profileData.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/Profile.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <img
                        src="/Profile.svg"
                        className="w-16 h-16 md:w-20 md:h-20 text-gray-500"
                        alt="Default profile"
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#8E6447] text-white p-2 rounded-full cursor-pointer hover:bg-[#7A5538] transition">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    document.querySelector('input[type="file"]')?.click()
                  }
                  className="w-full bg-[#8E6447] text-black py-3 rounded-lg hover:bg-[#7A5538] transition mb-4 font-medium"
                >
                  Upload New Photo
                </button>
              )}

              <p className="text-base md:text-lg text-gray-500">
                Since {formatDate(profileData.createdAt)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="space-y-5 md:space-y-6">
                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg pl-10 text-sm md:text-base ${
                        isEditing
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="Enter your full name"
                    />
                    <img
                      src="/Profile.svg"
                      className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                      alt="Profile icon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
                    />
                    <img
                      src="/mail.svg"
                      className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                      alt="Email icon"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg pl-10 text-sm md:text-base ${
                        isEditing
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    <img
                      src="/PhoneCall.svg"
                      className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                      alt="Phone icon"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-base md:text-lg font-medium">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="text-[#8E6447] text-sm md:text-base hover:underline font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value="**********"
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 pr-10 bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
                    />
                    <img
                      src="/Password.svg"
                      className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                      alt="Password icon"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg pl-10 text-sm md:text-base resize-none ${
                        isEditing
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                      placeholder="Enter your address"
                    />
                    <img
                      src="/Location.svg"
                      className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                      alt="Location icon"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 md:mt-8">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-[#8E6447] text-black py-3 rounded-lg font-semibold hover:bg-[#7A5538] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full bg-[#8E6447] text-black py-3 rounded-lg hover:bg-[#7A5538] transition font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-base md:text-lg font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={newPassword.current}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, current: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword.new}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, new: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={newPassword.confirm}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, confirm: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="flex-1 bg-[#8E6447] text-white py-3 rounded-lg font-semibold hover:bg-[#7A5538] transition disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword({ current: "", new: "", confirm: "" });
                }}
                disabled={changingPassword}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
