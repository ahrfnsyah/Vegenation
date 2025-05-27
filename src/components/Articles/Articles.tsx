import React, { useEffect } from 'react'; // ← tambahkan useEffect
import Image from 'next/image';
import styles from '@/components/Articles/articles.module.css';

interface Article {
  date: string;
  description: string;
  img_url: string;
  link: string;
  title: string;
}

interface Props {
  articles: Article[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
}

const Articles: React.FC<Props> = ({ articles = [], index = 0, onPrev, onNext }) => {
  const safeIndex = Math.max(0, Math.min(index, articles.length - 1));
  const article = articles[safeIndex];

useEffect(() => {
  const interval = setInterval(() => {
    onNext();
  }, 10000); // 3000ms = 3 detik

  return () => clearInterval(interval); // bersihkan saat unmount
}, [onNext]);

  if (!article) return null;
  
  return (
    <div className={styles.articleContainer}>
      {/* Kartu Artikel dengan Overlay */}
      <div className={styles.articleCard}>
        <div className={styles.imageWrapper}>
          {article.img_url ? (
            <Image
              src={article.img_url}
              alt={article.title || 'Image'}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 380px"
              unoptimized
            />
          ) : (
            <div className={styles.imageFallback} />
          )}

          {/* Tombol di atas gambar */}
          <button onClick={onPrev} className={`${styles.overlayNavButton} ${styles.leftOverlayButton}`}>←</button>
          <button onClick={onNext} className={`${styles.overlayNavButton} ${styles.rightOverlayButton}`}>→</button>

          {/* Konten overlay */}
          <div className={styles.overlayContent}>
            <h4 className={styles.articleTitle}>{article.title || 'No Title'}</h4>
            <p className={styles.articleDescription}>{article.description || 'No description available.'}</p>

            {/* Wrapper untuk date dan tombol */}
            <div className={styles.bottomRow}>
              <span className={styles.articleDate}>{article.date || 'Unknown date'}</span>
              <div className={styles.buttonGroup}>
                <button onClick={onPrev} className={`${styles.navButtonInline}`}>←</button>
                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.articleLink}
                  >
                    Baca selengkapnya
                  </a>
                )}
                <button onClick={onNext} className={`${styles.navButtonInline}`}>→</button>
              </div>
            </div>
          </div>

        </div>

      </div>


      {/* Tombol bawah (mobile) */}

    </div>
  );
};

export default Articles;
