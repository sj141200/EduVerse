export const getCourses = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses`);
    if (!response.ok) {
        throw new Error('Failed to fetch courses');
    }
    return await response.json();
};

export const createCourse = async (courseData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
    });
    if (!response.ok) {
        throw new Error('Failed to create course');
    }
    return await response.json();
};

export const getCourseById = async (courseId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch course details');
    }
    return await response.json();
};

export const updateCourse = async (courseId, courseData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
    });
    if (!response.ok) {
        throw new Error('Failed to update course');
    }
    return await response.json();
};

export const deleteCourse = async (courseId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete course');
    }
    return await response.json();
};