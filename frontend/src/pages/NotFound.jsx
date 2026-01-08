import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-black">
      <div className="text-center">
        <div className="backdrop-blur-sm rounded-2xl p-12 border border-gray-800 shadow-2xl">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
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
