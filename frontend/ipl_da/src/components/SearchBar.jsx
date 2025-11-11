import React, { useState, useEffect } from 'react';

function SearchBar({ items, placeholder, onSelect, itemDisplay }) {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items.filter(item => 
      (itemDisplay ? itemDisplay(item) : item).toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, items, itemDisplay]);

  const handleSelect = (item) => {
    onSelect(item);
    setSearch('');
  };

  return (
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
      />
      {search && (
        <ul className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredItems.map((item, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-700 cursor-pointer"
            >
              {itemDisplay ? itemDisplay(item) : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;