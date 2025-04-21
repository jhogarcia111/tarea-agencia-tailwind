import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import '../../context/DataContext';

const TopBar = () => {
  const { tasks, clients, users } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const results = [
        ...tasks.filter((task) => task.title.toLowerCase().includes(term.toLowerCase())),
        ...clients.filter((client) => client.name.toLowerCase().includes(term.toLowerCase())),
        ...users.filter((user) => user.name.toLowerCase().includes(term.toLowerCase())),
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="top-bar">
      <input
        type="text"
        placeholder="Buscar tareas, clientes o usuarios..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchResults.length > 0 && (
        <div className="search-results">
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result.title || result.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopBar;