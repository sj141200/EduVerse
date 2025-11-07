import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetails } from '../../services/courseService';

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const data = await getCourseDetails(courseId);
                setCourse(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <h2>Instructor: {course.instructor}</h2>
            <h3>Students Enrolled: {course.students.length}</h3>
            <h4>Assignments:</h4>
            <ul>
                {course.assignments.map(assignment => (
                    <li key={assignment.id}>{assignment.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default CourseDetails;