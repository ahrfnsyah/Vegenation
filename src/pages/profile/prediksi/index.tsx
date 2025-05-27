import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/profile.module.css';
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';

interface Prediction {
  commodityName: string;
  latestPrice: number;
  firstPrice: number;
  date: string;
  savedAt: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const predictionsPerPage = 4;
  const totalPages = Math.ceil(predictions.length / predictionsPerPage);
  const indexOfLast = currentPage * predictionsPerPage;
  const indexOfFirst = indexOfLast - predictionsPerPage;
  const currentPredictions = predictions.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const saved = localStorage.getItem('savedPredictions');
    if (saved) {
      setPredictions(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

 const handleDelete = (index: number) => {
  const newPredictions = [...predictions];
  newPredictions.splice((currentPage - 1) * predictionsPerPage + index, 1); // index global
  setPredictions(newPredictions);
  localStorage.setItem('savedPredictions', JSON.stringify(newPredictions));

  // Hitung total halaman baru
  const totalPages = Math.ceil(newPredictions.length / predictionsPerPage);

  // Jika currentPage terlalu besar untuk data baru, kurangi halaman
  if (currentPage > totalPages) {
    setCurrentPage(totalPages > 0 ? totalPages : 1);
  }
};

function formatCommodityName(name: string) {
  return name
    .replace(/_/g, ' ') // ganti underscore dengan spasi
    .replace(/\b\w/g, char => char.toUpperCase()); // kapitalisasi huruf awal tiap kata
}

  return (
    <>
      <Navbar />
      <div className={styles.profilePage}>
        <div className={styles.overlay}></div>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <h2>User Profile</h2>
            <ul className={styles.menuList}>
              <li onClick={() => router.push('/profile')}>
                <Image
                  src="/icons/profile.png"
                  alt="User Info"
                  width={24}
                  height={24}
                  className={styles.icon}
                />
                <span>Profil</span>
              </li>
              <li onClick={() => router.push('/profile/prediksi')}>
                <Image
                  src="/icons/prediksi.png"
                  alt="Prediksi"
                  width={24}
                  height={24}
                  className={styles.icon}
                />
                <span>Riwayat Prediksi</span>
              </li>
              <li onClick={handleLogout} className={styles.logoutButton}>
                <Image
                  src="/icons/logout.png"
                  alt="Logout"
                  width={24}
                  height={24}
                  className={styles.icon}
                />
                <span>Keluar</span>
              </li>
            </ul>
          </aside>
          <main className={styles.main}>
            <h2 className={styles.sectionTitle}>Riwayat Prediksi Tersimpan</h2>
            {predictions.length === 0 ? (
              <p className={styles.sectionDescription}>Tidak ada prediksi yang disimpan.</p>
            ) : (
              <>
                <div className={styles.predictionList}>
                  {currentPredictions.map((p, index) => (
                    <div key={index} className={styles.predictionCard}>
                      <h3>{formatCommodityName(p.commodityName)}</h3>
                      <p>Harga Prediksi: Rp {p.latestPrice.toLocaleString('id-ID')} /kg</p>
                      <p>Harga Awal: Rp {p.firstPrice.toLocaleString('id-ID')} /kg</p>
                      <p>Tanggal Prediksi: {p.date}</p>
                      <p>Disimpan pada: {new Date(p.savedAt).toLocaleString('id-ID')}</p>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                {predictions.length > predictionsPerPage && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </button>
                    <span>
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
