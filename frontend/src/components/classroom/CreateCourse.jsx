import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createCourse } from '../../services/courseService';

const CreateCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ name: courseName, description: courseDescription });
            history.push('/courses'); // Redirect to the courses page after creation
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div>
            <h2>Create New Course</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course Name:</label>
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Course Description:</label>
                    <textarea
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Course</button>
            </form>
        </div>
    );
};

export default CreateCourse;