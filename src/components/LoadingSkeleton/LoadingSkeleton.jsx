import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTag}></div>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonTitle} style={{ width: '60%' }}></div>
              <div className={styles.skeletonMeta}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText} style={{ width: '80%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
