import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/">
          <Button>Go back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;