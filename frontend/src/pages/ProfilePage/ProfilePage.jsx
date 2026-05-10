import { useEffect, useState } from "react";
import * as profileApi from "../../services/profile";

function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    profileApi
      .getProfile(token)
      .then((profile) => {
        if (!profile) {
          return;
        }

        setFormData({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          linkedin: profile.linkedin || "",
          github: profile.github || "",
          portfolio: profile.portfolio || "",
          summary: profile.summary || "",
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const existingProfile = await profileApi.getProfile(token);

      if (existingProfile) {
        await profileApi.updateProfile(token, payload);
        setMessage("Profile updated successfully.");
      } else {
        await profileApi.createProfile(token, payload);
        setMessage("Profile created successfully.");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Your Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          name="linkedin"
          type="url"
          placeholder="LinkedIn URL"
          value={formData.linkedin}
          onChange={handleChange}
        />
        <input
          name="github"
          type="url"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
        />
        <input
          name="portfolio"
          type="url"
          placeholder="Portfolio URL"
          value={formData.portfolio}
          onChange={handleChange}
        />
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={handleChange}
        />
        <input
          name="skills"
          type="text"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;