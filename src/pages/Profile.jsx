// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../services/authService";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    prefix: "",
    first_name: "",
    last_name: "",
    email: "",
    language: "English",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        prefix: user.prefix || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        language: user.language || "English",
      });

      const pictureUrl = user.profile_picture_url || user.profile_picture;
      if (pictureUrl) {
        setPreviewUrl(pictureUrl);
      }
    }
  }, [user]);

  // Handle profile form input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile picture file selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile update
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await authService.updateProfile(profileForm);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        if (result.data) {
          setUser?.(result.data);
          localStorage.setItem('flynet_user', JSON.stringify(result.data));

          const pictureUrl = result.data.profile_picture_url || result.data.profile_picture;
          console.log('here is pic', pictureUrl);
          
          if (pictureUrl) {
            setPreviewUrl(pictureUrl);
          }
        }
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handleChangePassword = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate passwords
      if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
        setError("All password fields are required");
        return;
      }

      if (passwordForm.new_password !== passwordForm.confirm_password) {
        setError("New password and confirmation do not match");
        return;
      }

      if (passwordForm.new_password.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }

      const result = await authService.changePassword(
        passwordForm.current_password,
        passwordForm.new_password,
        passwordForm.confirm_password
      );

      if (result.success) {
        setSuccess("Password changed successfully!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(result.message || "Failed to change password");
      }
    } catch (err) {
      setError(err?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Submit profile picture update
  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) {
      setError("Please select a profile picture");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("profile_picture", profilePicture);

      const result = await authService.updateProfilePicture(formData);

      if (result.success) {
        setSuccess("Profile picture updated successfully!");
        if (result.data) {
          setUser?.(result.data);
          localStorage.setItem('flynet_user', JSON.stringify(result.data));

          const pictureUrl = result.data.profile_picture_url || result.data.profile_picture;
          if (pictureUrl) {
            setPreviewUrl(pictureUrl);
          }
        }
        setProfilePicture(null);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(result.message || "Failed to update profile picture");
      }
    } catch (err) {
      setError(err?.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 0, sm: 0 } }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
        My Profile
      </Typography>

      {/* ALERTS */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* CHANGE PASSWORD */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Change Password
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="Current password"
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="New password"
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="Confirm new password"
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              onClick={handleChangePassword}
              disabled={loading}
              sx={{
                mt: 1,
                backgroundColor: "#0C2548",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} /> : null}
              Update Password
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* EDIT PROFILE + PROFILE PHOTO */}
      <Grid container spacing={3}>
        {/* Edit Profile */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Edit Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Prefix"
                  name="prefix"
                  value={profileForm.prefix}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Language"
                  name="language"
                  value={profileForm.language}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  sx={{
                    mt: 1,
                    backgroundColor: "#0C2548",
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} /> : null}
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Photo */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Profile Photo
            </Typography>

            {/* Profile Picture Preview */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <Avatar
                src={previewUrl}
                sx={{ width: 120, height: 120, fontSize: 40 }}
              >
                {profileForm.first_name?.[0]?.toUpperCase()}
              </Avatar>
            </Box>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload image:
            </Typography>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              disabled={loading}
              style={{ marginBottom: "8px" }}
            />

            <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
              Max file size: 5MB (JPG, PNG, GIF)
            </Typography>

            <Box textAlign="right">
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUpdateProfilePicture}
                disabled={loading || !profilePicture}
                sx={{
                  backgroundColor: "#0C2548",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} /> : null}
                Upload Picture
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
