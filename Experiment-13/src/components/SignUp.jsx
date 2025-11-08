import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const normalizedUsername = formData.username.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPassword = formData.password; // keep as typed; could hash in real app

    let users = [];
    try {
      const raw = localStorage.getItem("users");
      users = raw ? JSON.parse(raw) : [];
    } catch {
      users = [];
    }

    // migrate any previously stored emails to lowercase for consistency
    const migratedUsers = (users || []).map(u => ({
      ...u,
      email: (u?.email || "").trim().toLowerCase(),
    }));
    try {
      localStorage.setItem("users", JSON.stringify(migratedUsers));
    } catch {}

    const exists = migratedUsers.find(u => u.email === normalizedEmail);
    if (exists) {
      alert("User already exists!");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: normalizedPassword,
      role: formData.role,
    };

    const nextUsers = [...migratedUsers, newUser];
    try {
      localStorage.setItem("users", JSON.stringify(nextUsers));
    } catch {
      alert("Unable to save your account. Please check storage permissions.");
      return;
    }

    alert("Sign-up successful! Please sign in.");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <input type="text" name="username" placeholder="Username"
          value={formData.username} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="password" name="confirmPassword" placeholder="Confirm Password"
          value={formData.confirmPassword} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <select name="role" value={formData.role} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;