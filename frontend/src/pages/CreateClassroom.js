import React, { useState } from "react";

const CreateClassroom = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("Creating classroom...");

    try {
      // API call to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classrooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // assuming token stored after login
        },
        body: JSON.stringify({ name, subject, description })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Classroom created! Join Code: ${data.classroomCode}`);
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
      <h2 className="text-2xl font-bold mb-6">Create Classroom</h2>
      <form
        onSubmit={handleCreate}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Classroom Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full border p-2 rounded mb-4"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          Create
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

export default CreateClassroom;
