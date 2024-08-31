"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import LoginModal from "../_components/LoginModal";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [selectedDayType, setSelectedDayType] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [timings, setTimings] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTime, setEditedTime] = useState({ hours: "", minutes: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Authentication state listener
  useEffect(() => {
    const authStateListener = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => authStateListener(); // Cleanup listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  // Fetch data from Firestore based on selectedDayType and selectedDirection
  useEffect(() => {
    const fetchData = async () => {
      if (selectedDayType && selectedDirection) {
        setLoading(true); // Set loading to true before fetching data
        try {
          const docRef = doc(db, "shuttleTimings", selectedDayType);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data()[selectedDirection];
            setTimings(data);
          } else {
            console.error("Document does not exist");
            setTimings([]); // Clear timings if document does not exist
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setTimings([]); // Clear timings on error
        } finally {
          setLoading(false); // Set loading to false after data fetch is complete
        }
      }
    };

    fetchData();
  }, [selectedDayType, selectedDirection]); // Dependencies ensure useEffect is called when these change

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return { hours, minutes };
  };

  const handleEditClick = (index) => {
    const { hours, minutes } = formatTime(timings[index]);
    setEditingIndex(index);
    setEditedTime({ hours, minutes });
  };

  const handleSaveClick = async (index) => {
    const { hours, minutes } = editedTime;
    const timeInMinutes = hours * 60 + minutes;

    const updatedTimings = [...timings];
    updatedTimings[index] = timeInMinutes;
    setTimings(updatedTimings);
    setEditingIndex(null);

    try {
      const docRef = doc(db, "shuttleTimings", selectedDayType);
      await updateDoc(docRef, {
        [selectedDirection]: updatedTimings,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleTimeChange = (e, field) => {
    setEditedTime({
      ...editedTime,
      [field]: parseInt(e.target.value, 10) || 0,
    });
  };

  // Function to handle adding a new time
  const handleAddClick = async () => {
    const { hours, minutes } = editedTime;
    const timeInMinutes = hours * 60 + minutes;

    const updatedTimings = [...timings, timeInMinutes];
    setTimings(updatedTimings);

    try {
      const docRef = doc(db, "shuttleTimings", selectedDayType);
      await updateDoc(docRef, {
        [selectedDirection]: updatedTimings,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Function to handle removing a time
  const handleRemoveClick = async (index) => {
    const updatedTimings = timings.filter((_, i) => i !== index);
    setTimings(updatedTimings);

    try {
      const docRef = doc(db, "shuttleTimings", selectedDayType);
      await updateDoc(docRef, {
        [selectedDirection]: updatedTimings,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  if (!isAuthenticated) {
    return <LoginModal onClose={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 text-white w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button
          onClick={() => setSelectedDayType("weekend")}
          className={`w-full py-2 px-4 mb-2 rounded ${
            selectedDayType === "weekend" ? "bg-gray-600" : "bg-gray-700"
          }`}
        >
          Weekend
        </button>
        <button
          onClick={() => setSelectedDayType("weekday")}
          className={`w-full py-2 px-4 mb-2 rounded ${
            selectedDayType === "weekday" ? "bg-gray-600" : "bg-gray-700"
          }`}
        >
          Weekday
        </button>
      </div>

      <div className="flex-auto p-4">
        <nav className="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between">
          <div>
            <button
              onClick={() => setSelectedDirection("incoming")}
              className={`mr-4 py-2 px-4 rounded ${
                selectedDirection === "incoming" ? "bg-gray-500" : "bg-gray-600"
              }`}
              disabled={!selectedDayType}
            >
              Station to Campus
            </button>
            <button
              onClick={() => setSelectedDirection("outgoing")}
              className={`py-2 px-4 rounded mr-2 ${
                selectedDirection === "outgoing" ? "bg-gray-500" : "bg-gray-600"
              }`}
              disabled={!selectedDayType}
            >
              Campus to Station
            </button>
          </div>
          <div>
            <button
              onClick={handleGoToHome}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
            >
              Go to Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </nav>

        <div>
          {loading ? (
            <p className="text-gray-400">Loading timings...</p>
          ) : (
            <>
              {timings.length === 0 ? (
                <div>
                  <p className="text-gray-400">
                    {selectedDayType && selectedDirection
                      ? "No timings available."
                      : "Please select a day type and direction."}
                  </p>
                </div>
              ) : (
                <div className="overflow-auto" style={{maxHeight: 80 + "vh"}}>
                  <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                      <tr>
                        <th className="p-2 border-b border-gray-700">#</th>
                        <th className="p-2 border-b border-gray-700">Time</th>
                        <th className="p-2 border-b border-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {timings.map((time, index) => {
                        const { hours, minutes } = formatTime(time);
                        return (
                          <tr key={index}>
                            <td className="p-2 border-b border-gray-700 text-center">
                              {index + 1}
                            </td>
                            <td className="p-2 border-b border-gray-700">
                              {editingIndex === index ? (
                                <>
                                  <input
                                    type="number"
                                    value={editedTime.hours}
                                    onChange={(e) =>
                                      handleTimeChange(e, "hours")
                                    }
                                    min="0"
                                    max="23"
                                    placeholder="HH"
                                    className="w-16 mr-2 py-1 px-2 border border-gray-400 rounded bg-gray-800"
                                  />
                                  <span>:</span>
                                  <input
                                    type="number"
                                    value={editedTime.minutes}
                                    onChange={(e) =>
                                      handleTimeChange(e, "minutes")
                                    }
                                    min="0"
                                    max="59"
                                    placeholder="MM"
                                    className="w-16 ml-2 py-1 px-2 border border-gray-400 rounded bg-gray-800"
                                  />
                                </>
                              ) : (
                                `${String(hours).padStart(2, "0")}:${String(
                                  minutes
                                ).padStart(2, "0")}`
                              )}
                            </td>
                            <td className="p-2 border-b border-gray-700">
                              {editingIndex === index ? (
                                <div className="flex">
                                  <button
                                    onClick={() => handleSaveClick(index)}
                                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingIndex(null)}
                                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex">
                                  <button
                                    onClick={() => handleEditClick(index)}
                                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 mr-2"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleRemoveClick(index)}
                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-4">
                <div className="flex">
                  <input
                    type="number"
                    value={editedTime.hours}
                    onChange={(e) => handleTimeChange(e, "hours")}
                    min="0"
                    max="23"
                    placeholder="HH"
                    className="w-17 mr-2 py-2 px-4 border border-gray-400 rounded bg-gray-800"
                  />
                  <span className="self-center">:</span>
                  <input
                    type="number"
                    value={editedTime.minutes}
                    onChange={(e) => handleTimeChange(e, "minutes")}
                    min="0"
                    max="59"
                    placeholder="MM"
                    className="w-17 ml-2 py-2 px-4 border border-gray-400 rounded bg-gray-800"
                  />
                  <button
                    onClick={handleAddClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-4"
                    disabled={
                      editedTime.hours === "" || editedTime.minutes === ""
                    }
                  >
                    Add Time
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
