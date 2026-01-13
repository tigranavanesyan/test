import styles from './ErrorDisplay.module.css';

function ErrorDisplay({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className={styles.errorDisplay} role="alert">
      <div className={styles.errorDisplayContent}>
        <h2 className={styles.errorDisplayTitle}>Something went wrong</h2>
        <p className={styles.errorDisplayMessage}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={styles.errorDisplayButton}
            aria-label="Retry"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
