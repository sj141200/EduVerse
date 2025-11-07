export const getStudents = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/students`);
    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }
    return await response.json();
};

export const getStudentById = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/students/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch student');
    }
    return await response.json();
};

export const createStudent = async (studentData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
    });
    if (!response.ok) {
        throw new Error('Failed to create student');
    }
    return await response.json();
};

export const updateStudent = async (id, studentData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
    });
    if (!response.ok) {
        throw new Error('Failed to update student');
    }
    return await response.json();
};

export const deleteStudent = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/students/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete student');
    }
    return await response.json();
};