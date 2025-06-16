import React from "react";
import * as XLSX from "xlsx";
import styles from "@/styles/dashboard.module.css";

type ChartItem = {
  name: string;
  harga: number;
};

interface PredictionTableProps {
  data: ChartItem[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return utcDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatPrice = (price: number) => {
  return `Rp ${Math.round(price).toLocaleString("id-ID")}`;
};

const PredictionTable: React.FC<PredictionTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const handleExport = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `Prediksi_Harga_VegeNation_${timestamp}.xlsx`;

    const dataForExport = data.map((item) => ({
      Tanggal: formatDate(item.name),
      "Prediksi Harga (Rp/kg)": formatPrice(item.harga),
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prediksi Harga");

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Rincian Data Prediksi</h3>
        <button onClick={handleExport} className={styles.exportButton}>
          Export ke Excel
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.predictionTable}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Prediksi Harga per Kg</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.name)}</td>
                <td>{formatPrice(item.harga)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionTable;
