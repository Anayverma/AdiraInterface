"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../../config";

function Dashboard() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
      // Display a user-friendly error message to the user
      // Example: setLogoutError("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Dashboard, {user ? user.displayName : "Guest"}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
