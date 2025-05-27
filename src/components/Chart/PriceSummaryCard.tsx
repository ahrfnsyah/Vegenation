/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import styles from './PriceSummaryCard.module.css';

interface PriceSummaryCardProps {
  latestPrice?: number;
  previousPrice?: number;
  firstPrice?: number;
  date?: string;
  commodityName?: string;
}

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  latestPrice,
  previousPrice,
  firstPrice,
  date,
  commodityName,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    setIsLoggedIn(!!cookies.token); // asumsi login via cookie token
  }, []);

  if (latestPrice == null || firstPrice == null) {
    return (
      <div className={styles.card}>
        <div className={styles.title}>Memuat prediksi...</div>
      </div>
    );
  }

  function formatCommodityName(name: string) {
    return name
      .replace(/_/g, ' ') // Ganti underscore dengan spasi
      .replace(/\b\w/g, char => char.toUpperCase()); // Kapitalisasi huruf awal tiap kata
  }


  const changePercent = ((latestPrice - firstPrice) / firstPrice) * 100;
  const roundedChangePercent = Number(changePercent.toFixed(2));

  let indicator = '';
  let indicatorText = '';
  let indicatorClass = '';

  if (roundedChangePercent > 0) {
  indicator = '↗'; // Simbol naik
  indicatorText = 'Naik';
  indicatorClass = styles.indicatorRed; // Buat class ini berwarna merah
} else if (roundedChangePercent < 0) {
  indicator = '↘'; // Simbol turun
  indicatorText = 'Turun';
  indicatorClass = styles.indicatorGreen; // Buat class ini berwarna biru
} else {
  indicator = '→'; // Simbol stabil
  indicatorText = 'Stabil';
  indicatorClass = styles.indicatorWhite; // Buat class ini berwarna putih
}


  const handleSavePrediction = () => {
    const prediction = {
      commodityName,
      latestPrice,
      firstPrice,
      date,
      savedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('savedPredictions') || '[]');
    existing.push(prediction);
    localStorage.setItem('savedPredictions', JSON.stringify(existing));
    alert('Prediksi berhasil disimpan!');
  };

  return (
    <div className={styles.card}>
      <div>
        <div className={styles.title}>
          Prediksi Harga {commodityName ? formatCommodityName(commodityName) : ''}
        </div>

        <div className={styles.priceContainer}>
          <div className={styles.price}>
            Rp {latestPrice.toLocaleString('id-ID', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} <span className={styles.unit}>/kg</span>
          </div>
          <div className={`${styles.indicator} ${indicatorClass}`}>
            {indicator}{' '}
            {Math.abs(roundedChangePercent).toLocaleString('id-ID', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
            % ({indicatorText})
          </div>
        </div>

        <div className={styles.date}>{date ?? ''}</div>

        {isLoggedIn && (
          <button className={styles.saveButton} onClick={handleSavePrediction}>
            Simpan Prediksi
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceSummaryCard;
