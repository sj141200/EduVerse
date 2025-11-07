import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, count, link, description, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`${color} rounded-xl p-6 shadow-lg cursor-pointer`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color.replace('100', '200')}`}>
        {icon}
      </div>
      <span className="text-4xl font-bold">{count}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    classes: [],
    assignments: [],
    discussions: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [classesRes, assignmentsRes, discussionsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/classes`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/assignments`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/discussions`)
        ]);

        setStats({
          classes: classesRes.data,
          assignments: assignmentsRes.data,
          discussions: discussionsRes.data
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateClass = async () => {
    try {
      navigate('/create-classroom');
    } catch (err) {
      setError('Failed to create class');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-xl">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-4xl font-bold text-gray-800"
        >
          Welcome to EduVerse
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateClass}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg 
                   shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Create New Class
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Active Classes"
          count={stats.classes.length}
          link="/classes"
          description="View and manage your classes"
          color="bg-blue-100"
          onClick={() => navigate('/classes')}
        />
        <DashboardCard
          title="Pending Assignments"
          count={stats.assignments.length}
          link="/assignments"
          description="Track your assignments"
          color="bg-green-100"
          onClick={() => navigate('/assignments')}
        />
        <DashboardCard
          title="Active Discussions"
          count={stats.discussions.length}
          link="/discussions"
          description="Join class discussions"
          color="bg-purple-100"
          onClick={() => navigate('/discussions')}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {stats.classes.slice(0, 3).map((activity, index) => (
          <motion.div
            key={index}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/classes/${activity.id}`)}
          >
            <h3 className="font-semibold">{activity.name}</h3>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;