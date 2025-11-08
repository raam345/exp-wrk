import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Update username to "Ganugapati Sriram"
  useEffect(() => {
    if (user) {
      // Update sessionStorage
      const updatedUser = { ...user, username: "Ganugapati Sriram" };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Also update localStorage users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].username = "Ganugapati Sriram";
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-pink-400 p-4 text-white">
        <h1 className="text-2xl font-bold">Product Management System</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate("/")} className="hover:underline">Home</button>
          <button onClick={() => navigate("/logout")} className="hover:underline">Logout</button>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome Ganugapati Sriram!</h2>
        <p className="mb-6 text-gray-600">Manage products, users, and view analytics.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-50"
               onClick={() => navigate("/manage-products")}>
            <h3 className="text-xl font-semibold text-blue-500">Manage Products</h3>
            <p>Add, edit, and delete products.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-50"
               onClick={() => navigate("/usermanagement")}>
            <h3 className="text-xl font-semibold text-green-500">User Management</h3>
            <p>Manage user roles and accounts.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-50"
               onClick={() => navigate("/analytics")}>
            <h3 className="text-xl font-semibold text-purple-500">Analytics</h3>
            <p>View reports and insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;