import React, { useState } from 'react';

const SearchComponent = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(inputValue); // Call the search function passed as a prop
    setInputValue(''); // Clear the input after search
  };

  return (
    <form onSubmit={handleSearch} className='search-bar'>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter city name"
      />
      <button className='search-button' type="submit">Search</button>
    </form>
  );
};

export default SearchComponent;
