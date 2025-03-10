"use client";

import { ShieldCheck, UserCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { updateUserRole, findUser } from "./actions";

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [newRole, setNewRole] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) {
      setMessage("Please enter a username");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await findUser(username);
      
      if (result.user) {
        setSearchedUser(result.user);
        setNewRole(result.user.role);
        setMessageType("success");
      } else {
        setSearchedUser(null);
        setMessage("User not found");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error searching for user");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!searchedUser || !newRole) {
      setMessage("Please search for a user and select a role");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await updateUserRole(searchedUser.username, newRole);
      
      if (result.success) {
        setMessage(`Successfully updated ${searchedUser.username}'s role to ${newRole}`);
        setMessageType("success");
        
        // Update the displayed user data
        setSearchedUser({
          ...searchedUser,
          role: newRole
        });
      } else {
        setMessage(result.error || "Failed to update role");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error updating user role");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <ShieldCheck className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-300 mt-2 mb-8">Manage users, permissions, and system settings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left column: User Role Management */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <UserCog className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-xl font-semibold">User Role Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm text-gray-300">Username</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter username"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
            
            {searchedUser && (
              <div className="space-y-4 mt-4 p-4 border border-gray-700 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-gray-400">Username:</p>
                  <p>{searchedUser.username}</p>
                  
                  <p className="text-sm text-gray-400">Email:</p>
                  <p>{searchedUser.email}</p>
                  
                  <p className="text-sm text-gray-400">Current Role:</p>
                  <p>{searchedUser.role}</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="role" className="text-sm text-gray-300">New Role</label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Security Engineer">Security Engineer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <button
                  onClick={handleRoleUpdate}
                  disabled={isLoading || newRole === searchedUser.role}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Role"}
                </button>
              </div>
            )}
            
            {message && (
              <div className={`p-3 rounded-md ${messageType === 'success' ? 'bg-green-800' : 'bg-red-800'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column: Grafana and other links */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-6">System Analytics</h2>
          <Link
            href="http://localhost:4000/d/admin-dashboard/admin-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
            target="_blank"
          >
            <button className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 mb-4 w-60">
              Open Security Dashboard
            </button>
          </Link>
          
          <Link
            href="http://localhost:4000/dashboards"
            target="_blank"
          >
            <button className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 w-60">
              Browse All Dashboards
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}