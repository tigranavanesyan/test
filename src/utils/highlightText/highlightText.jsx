import React from 'react';
import styles from './highlightText.module.css';

/**
 * Подсвечивает текст, который совпадает с поисковым запросом
 * @param {string} text - текст для подсветки
 * @param {string} searchQuery - поисковый запрос
 * @returns {React.ReactNode} JSX элемент с подсвеченным текстом
 */
export function highlightText(text, searchQuery) {
  if (!searchQuery.trim()) {
    return text;
  }

  const query = searchQuery.trim();
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Проверяем совпадение без использования regex.test() чтобы избежать проблем с lastIndex
    const isMatch = part.toLowerCase() === query.toLowerCase();
    if (isMatch) {
      return (
        <mark key={index} className={styles.highlightMark}>
          {part}
        </mark>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
