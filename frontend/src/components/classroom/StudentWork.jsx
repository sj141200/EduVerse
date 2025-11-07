import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentWork } from '../../services/studentService';

const StudentWork = () => {
    const { assignmentId } = useParams();
    const [studentWork, setStudentWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentWork = async () => {
            try {
                const work = await getStudentWork(assignmentId);
                setStudentWork(work);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentWork();
    }, [assignmentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Submitted Work for Assignment {assignmentId}</h2>
            <ul>
                {studentWork.map((work) => (
                    <li key={work.id}>
                        <h3>{work.studentName}</h3>
                        <p>{work.submission}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentWork;