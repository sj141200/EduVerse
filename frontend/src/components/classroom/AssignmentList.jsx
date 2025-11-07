import React, { useEffect, useState, useContext } from 'react';
import { ClassroomContext } from '../../context/ClassroomContext';
import { getAssignments } from '../../services/assignmentService';

const AssignmentList = () => {
  const { courseId } = useContext(ClassroomContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments(courseId);
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId]);

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;