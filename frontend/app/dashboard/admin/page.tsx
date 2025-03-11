"use client";

import { ShieldCheck, UserCog, UserPlus, Users, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { updateUserRole, findUser, getPendingUsers } from "./actions";

// Define types for our data structures
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [username, setUsername] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<"pending" | "search">("pending"); // "pending" or "search"

  // Fetch pending users on component mount
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const result = await getPendingUsers();
        if (result.success && result.users) {
          setPendingUsers(result.users);
        }
      } catch {
        console.error("Error fetching pending users");
      }
    };

    fetchPendingUsers();
  }, []);

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
    } catch {
      setMessage("Error searching for user");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userToUpdate: string, role: string) => {
    setIsLoading(true);
    
    try {
      const result = await updateUserRole(userToUpdate, role);
      
      if (result.success) {
        setMessage(`Successfully updated ${userToUpdate}&apos;s role to ${role}`);
        setMessageType("success");
        
        // Update the displayed user data if this is the searched user
        if (searchedUser && searchedUser.username === userToUpdate) {
          setSearchedUser({
            ...searchedUser,
            role: role
          });
        }
        
        // If updating a pending user, remove them from the pending list
        if (role !== "Pending") {
          setPendingUsers(prev => prev.filter(user => user.username !== userToUpdate));
        }
      } else {
        setMessage(result.error || "Failed to update role");
        setMessageType("error");
      }
    } catch {
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

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setTab("pending")}
          className={`px-6 py-3 flex items-center ${tab === "pending" ? "bg-yellow-700 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Pending Approvals
        </button>
        <button
          onClick={() => setTab("search")}
          className={`px-6 py-3 flex items-center ${tab === "search" ? "bg-yellow-700 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          <Search className="w-5 h-5 mr-2" />
          User Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left column: User Role Management */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          {tab === "pending" ? (
            <>
              <div className="flex items-center mb-4">
                <UserPlus className="w-6 h-6 text-yellow-400 mr-2" />
                <h2 className="text-xl font-semibold">Pending Role Assignments</h2>
              </div>
              
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mb-3 mx-auto" />
                  <p>No pending users at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="p-4 border border-gray-700 rounded-md">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <p className="text-sm text-gray-400">Username:</p>
                        <p>{user.username}</p>
                        
                        <p className="text-sm text-gray-400">Email:</p>
                        <p>{user.email}</p>
                        
                        <p className="text-sm text-gray-400">Status:</p>
                        <p className="text-amber-400">Awaiting Role Assignment</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm text-gray-300">Assign Role</label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRoleUpdate(user.username, "Security Engineer")}
                            disabled={isLoading}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            Security
                          </button>
                          <button
                            onClick={() => handleRoleUpdate(user.username, "Software Engineer")}
                            disabled={isLoading}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            Software
                          </button>
                          <button
                            onClick={() => handleRoleUpdate(user.username, "Manager")}
                            disabled={isLoading}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            Manager
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
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
                        <option value="Pending">Pending</option>
                        <option value="Security Engineer">Security Engineer</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => handleRoleUpdate(searchedUser.username, newRole)}
                      disabled={isLoading || newRole === searchedUser.role}
                      className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Updating..." : "Update Role"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          
          {message && (
            <div className={`p-3 mt-4 rounded-md ${messageType === 'success' ? 'bg-green-800' : 'bg-red-800'}`}
                 dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        </div>
        
        {/* Right column: Grafana and other links */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-6">System Analytics</h2>
          <Link
            href="http://172.20.10.3:4000/d/admin-dashboard/admin-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
            target="_blank"
          >
            <button className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 mb-4 w-60">
              Open Security Dashboard
            </button>
          </Link>
          
          <Link
            href="http://172.20.10.3:4000/dashboards"
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