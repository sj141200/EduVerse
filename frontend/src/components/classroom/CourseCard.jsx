import React from 'react';

const CourseCard = ({ course, onEnroll }) => {
    return (
        <div className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor}</p>
            <p>Duration: {course.duration} hours</p>
            <button onClick={() => onEnroll(course.id)}>Enroll</button>
        </div>
    );
};

export default CourseCard;