import PostCard from '../PostCard/PostCard';
import styles from './PostList.module.css';

function PostList({ posts, onPostClick, searchQuery = "", totalPosts = 0 }) {
  // Generate unique key for each post
  const getPostKey = (post, index) => {
    // Try to use a combination of unique fields as key
    // If post has an id field, use it; otherwise use title + date combination
    if (post.id) {
      return post.id;
    }
    // Create a stable key from post data
    return `${post.title}-${post.date}-${index}`;
  };

  if (posts.length === 0) {
    return (
      <div className={styles.postListContainer}>
        <div className={styles.postListEmpty}>
          <p className={styles.postListEmptyText}>
            {searchQuery.trim() 
              ? `No posts found matching "${searchQuery}"` 
              : 'No posts available'}
          </p>
          {searchQuery.trim() && totalPosts > 0 && (
            <p className={styles.postListEmptyHint}>
              Try a different search term or clear your search
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.postListContainer}>
      {searchQuery.trim() && (
        <div className={styles.postListResults} role="status" aria-live="polite">
          <p className={styles.postListResultsText}>
            Found {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            {totalPosts > posts.length && ` of ${totalPosts} total`}
          </p>
        </div>
      )}
      <div className={styles.postListGrid}>
        {posts.map((post, index) => (
          <div
            key={getPostKey(post, index)}
            className={styles.postListItem}
          >
            <PostCard post={post} onClick={() => onPostClick(post)} searchQuery={searchQuery} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
