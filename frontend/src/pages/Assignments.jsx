import React, { useState } from 'react';

const Assignments = () => {
  const [assignments] = useState([
    {
      id: 1,
      title: "Term Paper",
      subject: "Computer Science",
      dueDate: "2023-11-15",
      status: "pending"
    },
    {
      id: 2,
      title: "Math Problems Set 3",
      subject: "Mathematics",
      dueDate: "2023-11-10",
      status: "submitted"
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Due Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id} className="border-b">
                <td className="px-6 py-4">{assignment.title}</td>
                <td className="px-6 py-4">{assignment.subject}</td>
                <td className="px-6 py-4">{assignment.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${
                    assignment.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;