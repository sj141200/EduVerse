import React from 'react';

const Header = () => {
    return (
        <header style={{ padding: '20px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <h1 style={{ margin: 0 }}>Google Classroom</h1>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/courses">Courses</a></li>
                    <li><a href="/assignments">Assignments</a></li>
                    <li><a href="/students">Students</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;