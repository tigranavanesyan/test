import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../Icons";
import { highlightText } from "../../utils/highlightText/highlightText";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import styles from "./PostModal.module.css";

function PostModal({ post, onClose, searchQuery = "" }) {
  const modalContentRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Focus trap for accessibility
  useFocusTrap(!!post, modalContentRef);

  useEffect(() => {
    if (post) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      
      // Блокируем скролл страницы на body и html
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      
      return () => {
        // Разблокируем скролл страницы
        const scrollY = document.body.style.top;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.documentElement.style.overflow = "";
        
        // Восстанавливаем позицию скролла
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      };
    } else {
      // Разблокируем скролл страницы
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    }
  }, [post]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!post) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [post, onClose]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Reset image state when post changes
  useEffect(() => {
    if (post) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [post]);

  if (!post) return null;

  return (
    <div
      className={styles.postModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-title"
    >
      <div
        ref={modalContentRef}
        className={styles.postModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={styles.postModalClose}
          aria-label="Close modal"
        >
          <CloseIcon className={styles.postModalCloseIcon} />
        </button>
        <div className={styles.postModalImageWrapper}>
          {imageLoading && !imageError && (
            <div className={styles.postModalImagePlaceholder} aria-hidden="true" />
          )}
          {!imageError ? (
            <img
              src={post.img}
              srcSet={`${post.img} 1x, ${post.img_2x} 2x`}
              alt={post.title}
              className={`${styles.postModalImage} ${imageLoading ? styles.postModalImageLoading : ''}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className={styles.postModalImageError} aria-label="Image failed to load">
              <span>Image unavailable</span>
            </div>
          )}
        </div>
        <div className={styles.postModalBody}>
          <span className={styles.postModalTags}>
            {post.tags}
          </span>
          <h1 id="post-modal-title" className={styles.postModalTitle}>
            {highlightText(post.title, searchQuery)}
          </h1>
          <div className={styles.postModalMeta}>
            <span className={styles.postModalAuthor}>{post.autor}</span>
            <div className={styles.postModalMetaRight}>
              <span>{post.date}</span>
              <span>{post.views} views</span>
            </div>
          </div>
          <p className={styles.postModalText}>
            {highlightText(post.text, searchQuery)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
