import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>EduVerse</h1>
            <nav>
                <Link to="/courses">Courses</Link> |{" "}
                <Link to="/create-classroom">Create Classroom</Link>
            </nav>
        </div>
    );
}