import React, { useState } from "react";

const JoinClassroom = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setMessage("Joining classroom...");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classrooms/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Joined ${data.classroomName} successfully!`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Server error, please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">Join Classroom</h2>
      <form
        onSubmit={handleJoin}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter Classroom Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full border p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
        >
          Join
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center font-semibold text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
};

export default JoinClassroom;
