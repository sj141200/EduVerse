export const getAssignments = async (courseId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/assignments`);
    if (!response.ok) {
        throw new Error('Failed to fetch assignments');
    }
    return await response.json();
};

export const createAssignment = async (courseId, assignmentData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/assignments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
    });
    if (!response.ok) {
        throw new Error('Failed to create assignment');
    }
    return await response.json();
};

export const submitAssignment = async (assignmentId, submissionData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
    });
    if (!response.ok) {
        throw new Error('Failed to submit assignment');
    }
    return await response.json();
};