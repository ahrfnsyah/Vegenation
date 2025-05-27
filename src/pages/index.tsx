// index.tsx
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import Image from 'next/image';
import FloatingChatbot from '@/components/Chatbot/FloatingChatbot';
import TeamModal from '@/components/Team/TeamModal';
import { FaChartLine, FaNewspaper, FaRobot, FaChartBar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

interface Article {
  date: string;
  description: string;
  img_url: string;
  link: string;
  title: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  const [showDemo, setShowDemo] = useState(false);
  const [showTeam, setShowTeam] = useState(false);



  useEffect(() => {
    fetch('https://pblpnj.lokatani.id/vegenation/get_articles') // Ganti URL dengan API kamu
      .then(res => res.json())
      .then(data => setArticles(data.results))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <Image
              src="/background.jpg"
              alt="Sayur"
              fill
              priority
              className={styles.heroImage}
            />
            <div className={styles.overlay}></div>
          </div>

          <div className={styles.heroText}>
            <span className={styles.badge}>Prediksi Harga, Tanam Keputusan yang Lebih Pasti</span>
            <h1 className={styles.title}>Vegenation</h1>
            <p className={styles.description}>
              Vegenation hadir untuk membantu Anda memetakan tren harga komoditas sayuran secara real-time, akurat,
              dan berbasis data, agar bisnis agrikultur Anda makin cerdas dan tahan fluktuasi.
            </p>

            <div className={styles.buttonGroup}>
              <Link href="/auth/login" className={styles.ctaButton}>
                Dashboard →
              </Link>
              <button
                onClick={() => setShowDemo(true)}
                className={styles.demoButton}
              >
                ▶ Lihat Demo
              </button>
            </div>
          </div>

          {/* Demo Modal */}
          {showDemo && (
            <div className={styles.demoModal}>
              <div className={styles.modalContent}>
                <iframe
                  src="https://drive.google.com/file/d/17-6ca0hvOIplg3VDVQd0wMRj4Lyim01w/preview"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setShowDemo(false)}
                  className={styles.closeButton}
                >
                  Tutup Demo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Fitur Unggulan Section */}
        <section className={styles.featuresSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Fitur Unggulan Vegenation</h2>
            <p className={styles.sectionSubtitle}>Solusi lengkap untuk manajemen komoditas pertanian Anda</p>

            <div className={styles.featuresGrid}>
              {/* Fitur 1 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaChartLine />
                </div>
                <h3>Prediksi Harga</h3>
                <p>Dapatkan prediksi harga komoditas sayuran berbasis AI untuk membantu perencanaan bisnis Anda.</p>
              </div>

              {/* Fitur 2 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaNewspaper />
                </div>
                <h3>Artikel Komoditas</h3>
                <p>Informasi terupdate tentang tren pasar, tips budidaya, dan perkembangan terbaru di industri.</p>
              </div>

              {/* Fitur 3 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaRobot />
                </div>
                <h3>Chatbot Interaktif</h3>
                <p>Tanya jawab seputar pertanian dengan AI kami yang siap membantu 24/7.</p>
              </div>

              {/* Fitur 4 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaChartBar />
                </div>
                <h3>Visualisasi Data</h3>
                <p>Grafik dan dashboard interaktif untuk analisis tren harga yang mudah dipahami.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Artikel Section */}
        <section id="articles" className={styles.articleSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Artikel Terkini</h2>
            <p className={styles.sectionSubtitle}>Update berita dan informasi penting dunia pertanian</p>

            <Slider
              dots={true}
              infinite={true}
              speed={500}
              autoplay={true} // <- aktifkan autoplay
              autoplaySpeed={3000} // <- 3000 ms = 3 detik
              slidesToShow={3}
              slidesToScroll={1}
              dotsClass={`slick-dots ${styles.customDots}`}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: { slidesToShow: 2 }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    dotsClass: `slick-dots ${styles.mobileDots}`
                  }
                }
              ]}
            >
              {articles.map((article, index) => (
                <div key={index} className={styles.articleCardWrapper}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.articleCard}>
                    <Image
                      src={article.img_url}
                      alt={article.title}
                      width={400}
                      height={200}
                      className={styles.articleImage}
                      unoptimized
                    />
                    <div className={styles.articleContent}>
                      <h3 className={styles.articleTitle}>{article.title}</h3>
                      <p className={styles.articleDescription}>{article.description}</p>
                      <span className={styles.articleDate}>{article.date}</span>
                    </div>
                  </a>
                </div>
              ))}
            </Slider>

          </div>
        </section>

        {/* About Section */}
        <section id="about" className={styles.aboutSection}>
          <span className={styles.tagline}>Teknologi untuk Pertanian Berkelanjutan</span>
          <h2 className={styles.sectionTitle}>Tentang Vegenation</h2>

          <div className={styles.aboutGrid}>
            <p className={styles.aboutText}>
              <strong>VegeNation</strong> merupakan platform digital yang dirancang untuk membantu petani, pedagang, dan pelaku agrikultur
              dalam memantau serta memprediksi harga komoditas sayuran secara <em>real-time</em>.
              Didukung oleh teknologi <strong><em>machine learning</em> (LSTM dengan mekanisme <em>attention</em>)</strong>,
              VegeNation menyajikan prediksi harga yang akurat, disertai dengan dashboard interaktif,
              artikel pasar terkini, dan chatbot AI untuk memberikan wawasan serta dukungan berbasis data.
            </p>

            <p className={styles.aboutText}>
              Platform ini dibangun berdasarkan riset kebutuhan pengguna dan berfokus pada pemberdayaan pertanian lokal
              melalui pendekatan teknologi yang adaptif dan ramah pengguna.
              VegeNation hadir sebagai bagian dari solusi menuju sistem prediksi harga pangan yang lebih
              <em> cerdas, berkelanjutan, dan berkeadilan</em>.
            </p>

          </div>
          <TeamModal show={showTeam} onClose={() => setShowTeam(false)} />
          <button onClick={() => setShowTeam(true)} className={styles.teamButton}>
            Tim Pengembang →
          </button>
        </section>

        <FloatingChatbot />
        <Footer />
      </div>
    </>
  );
}