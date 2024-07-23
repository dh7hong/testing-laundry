'use client';

import { useState, useEffect, ChangeEvent } from 'react';

interface SearchResult {
  title: string;
  link: string;
}

export default function LocalSearch() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fullResponse, setFullResponse] = useState<object | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setFullResponse(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search/local?query=${query}`);
        const data = await response.json();
        
        console.log('Full response:', data); // Log the full response
        setFullResponse(data); // Save the full response to state for rendering

        if (response.ok) {
          setResults(data.items || []);
        } else {
          console.error('Error fetching data:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };

    const debounceFetch = setTimeout(fetchData, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for locations"
      />
      {loading && <p>Loading...</p>}
      {fullResponse && (
        <div>
          <h3>Full Response:</h3>
          <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
        </div>
      )}
      <ul>
        {results.map((item) => (
          <li key={item.link}>{item.roadAddress}</li>
        ))}
      </ul>
    </div>
  );
}
