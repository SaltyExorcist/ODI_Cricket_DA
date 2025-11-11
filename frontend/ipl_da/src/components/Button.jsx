import React from 'react';

function Button({ onClick, children }) {
  return (
    <button 
      onClick={onClick} 
      className="w-1/4 py-2 px-4 bg-blue-600 text-white border border-blue-600 rounded cursor-pointer text-base transition-colors duration-300 hover:bg-blue-700"
    >
      {children}
    </button>
  );
}

export default Button;