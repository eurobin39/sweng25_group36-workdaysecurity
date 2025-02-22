"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = () => {
        if (!username || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        alert("Registration successful!");
        router.push("/login");
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(to right, #4facfe, #00f2fe)"
        }}>
            <div style={{
                width: "300px",
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                borderRadius: "8px"
            }}>
                <h2 style={{ textAlign: "center" }}>Register</h2>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
                <button
                    onClick={handleRegister}
                    style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;
