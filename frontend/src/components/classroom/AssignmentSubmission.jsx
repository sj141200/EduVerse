import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitAssignment } from '../../services/assignmentService';

const AssignmentSubmission = () => {
    const { assignmentId } = useParams();
    const [submission, setSubmission] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await submitAssignment(assignmentId, { submission });
            setSuccess(true);
        } catch (err) {
            setError('Failed to submit assignment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Submit Assignment</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Assignment submitted successfully!</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="Write your submission here..."
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AssignmentSubmission;