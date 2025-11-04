import { useState, useEffect } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const { search, setSearch, setPage } = useProductFilters();
  const [localSearch, setLocalSearch] = useState(search);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localSearch.length > 2) {
      fetch(`http://localhost:8000/api/products/search/suggestions?query=${localSearch}`)
        .then(res => res.json())
        .then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [localSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
    setPage(1);
    setSuggestions([]);
    navigate('/boutique');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearch(suggestion);
    setSearch(suggestion);
    setPage(1);
    setSuggestions([]);
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
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;