import React, { useState } from 'react';

const Discussions = () => {
  const [discussions] = useState([
    {
      id: 1,
      topic: "Project Ideas Discussion",
      class: "Computer Science",
      lastActive: "2 hours ago",
      replies: 15
    },
    {
      id: 2,
      topic: "Week 3 Study Group",
      class: "Mathematics",
      lastActive: "1 day ago",
      replies: 8
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discussions</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          New Discussion
        </button>
      </div>

      <div className="space-y-4">
        {discussions.map(discussion => (
          <div key={discussion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{discussion.topic}</h3>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>Class: {discussion.class}</span>
              <span>Last active: {discussion.lastActive}</span>
              <span>Replies: {discussion.replies}</span>
            </div>
            <button className="mt-4 text-blue-500 hover:text-blue-700">
              Join Discussion →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussions;