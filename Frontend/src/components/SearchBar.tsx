import React, { useState } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const { search, setSearch, setPage } = useProductFilters();
  const [localSearch, setLocalSearch] = useState(search);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
    setPage(1);
    navigate('/boutique');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Rechercher des produits..."
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        🔍
      </button>
    </form>
  );
};

export default SearchBar;