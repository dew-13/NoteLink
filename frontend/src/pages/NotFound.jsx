import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="bg-gradient-to-br from-[#262a4a]/80 to-[#1e2139]/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 shadow-2xl">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <p className="text-xl text-gray-400 mb-8">Page not found</p>
          <Link to="/" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
