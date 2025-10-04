import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <img 
            src="https://i.imgur.com/M3Gt3OA.png" 
            alt="Logo da Sandy's Pet Shop" 
            className="h-12 w-12 object-contain"
          />
          <h1 className="ml-3 text-5xl font-corinthia font-bold text-brand-pink-dark tracking-wider">
            Sandy's Pet Shop
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;