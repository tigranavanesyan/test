import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header/Header';
import PostList from './components/PostList/PostList';
import PostModal from './components/PostModal/PostModal';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import LoadingSkeleton from './components/LoadingSkeleton/LoadingSkeleton';
import { useDebounce } from './hooks/useDebounce';
import { API_URL, SEARCH_CONFIG } from './constants';

function App() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_CONFIG.DEBOUNCE_DELAY);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Memoize filtered posts for better performance
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return posts;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.text?.toLowerCase().includes(query)
    );
  }, [debouncedSearchQuery, posts]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
    // Removed searchQuery clearing - unexpected behavior
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        console.error('Error fetching posts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={handleRetry} />
        ) : (
          <PostList 
            posts={filteredPosts} 
            onPostClick={handlePostClick} 
            searchQuery={searchQuery}
            totalPosts={posts.length}
          />
        )}
      </main>
      <PostModal post={selectedPost} onClose={handleCloseModal} searchQuery={searchQuery} />
    </div>
  );
}

export default App;
