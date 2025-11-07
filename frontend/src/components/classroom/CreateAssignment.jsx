import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment } from '../../services/assignmentService';

const CreateAssignment = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const assignmentData = { title, description, dueDate };
        await createAssignment(assignmentData);
        navigate('/assignments');
    };

    return (
        <div>
            <h2>Create Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Assignment</button>
            </form>
        </div>
    );
};

export default CreateAssignment;