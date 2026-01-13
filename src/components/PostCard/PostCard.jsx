import { memo, useState } from "react";
import { highlightText } from "../../utils/highlightText/highlightText";
import styles from "./PostCard.module.css";

function PostCard({ post, onClick, searchQuery = "" }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <article
      onClick={onClick}
      className={styles.postCard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View post: ${post.title}`}
    >
      <div className={styles.postCardImageWrapper}>
        {imageLoading && !imageError && (
          <div className={styles.postCardImagePlaceholder} aria-hidden="true" />
        )}
        {!imageError ? (
          <img
            src={post.img}
            srcSet={`${post.img} 1x, ${post.img_2x} 2x`}
            alt={post.title}
            className={`${styles.postCardImage} ${imageLoading ? styles.postCardImageLoading : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div className={styles.postCardImageError} aria-label="Image failed to load">
            <span>Image unavailable</span>
          </div>
        )}
      </div>
      <div className={styles.postCardContent}>
        <span className={styles.postCardTags}>
          {post.tags}
        </span>
        <h2 className={styles.postCardTitle}>
          {highlightText(post.title, searchQuery)}
        </h2>
        <div className={styles.postCardMeta}>
          <span>{post.autor}</span>
          <span className={styles.postCardDot} />
          <span className={styles.postCardMetaSecondary}>{post.date}</span>
          <span className={styles.postCardDot} />
          <span className={styles.postCardMetaSecondary}>{post.views} Views</span>
        </div>
        <p className={styles.postCardText}>
          {highlightText(post.text, searchQuery)}
        </p>
      </div>
    </article>
  );
}

export default memo(PostCard);
