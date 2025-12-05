// src/pages/SearchPage.jsx
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container section">
      <h1 className="section-title">Search Results</h1>
      {query && <p className="text-secondary">Searching for: "{query}"</p>}
      <p className="text-tertiary" style={{ marginTop: '20px' }}>
        Arama sonuçları sayfası yakında eklenecek...
      </p>
    </div>
  );
};

export default SearchPage;