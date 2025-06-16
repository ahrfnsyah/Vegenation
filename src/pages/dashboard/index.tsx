/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styles from "@/styles/dashboard.module.css";
import PriceChart from "@/components/Chart/PriceChart";
import BarPriceChart from "@/components/Chart/BarPriceChart";
import PriceSummaryCard from "@/components/Chart/PriceSummaryCard";
import Articles from "@/components/Articles/Articles";
import ChatBot from "@/components/Chatbot/Chatbot";
import { fetchPrediction, fetchArticles } from "@/lib/api";
import { parseISO, format, startOfWeek, startOfMonth } from "date-fns";
import Navbar from "@/components/Navbar/Navbar";
import PredictionTable from "@/components/Table/PredictionTable";

const aggregateData = (data: ChartItem[], mode: "day" | "week" | "month") => {
  if (mode === "day") return data;

  const grouped: { [key: string]: number[] } = {};

  data.forEach((item) => {
    const date = parseISO(item.name);
    let key = item.name;

    if (mode === "week") key = format(startOfWeek(date), "yyyy-MM-dd");
    if (mode === "month") key = format(startOfMonth(date), "yyyy-MM");

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item.harga);
  });

  return Object.entries(grouped).map(([key, prices]) => ({
    name: key,
    harga: prices.reduce((sum, p) => sum + p, 0) / prices.length, // average
  }));
};

type ChartItem = {
  name: string;
  harga: number;
};

const Dashboard: React.FC = () => {
  const [predictedCommodity, setPredictedCommodity] = useState<string>("");
  const [, setPredictedDate] = useState<string>("");
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const [articles, setArticles] = useState<any[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);

  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommodity(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const calculateMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split("T")[0];
  };

  const minDate = calculateMinDate();

  const [selectedCommodity, setSelectedCommodity] = useState("cabai");
  // Initialize selectedDate with the calculated minimum date
  const [selectedDate, setSelectedDate] = useState(minDate);

  const handlePredict = async () => {
    if (!selectedCommodity || !selectedDate) {
      return alert("Pilih komoditas dan tanggal terlebih dahulu!");
    }

    try {
      const result = await fetchPrediction(selectedCommodity, 90);
      const data: ChartItem[] = result?.predictions
        ? Object.entries(result.predictions).map(([date, price]) => ({
            name: date,
            harga: Number(price),
          }))
        : [];

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const filtered = data.filter(
        (item) => item.name >= todayStr && item.name <= selectedDate
      );

      setChartData(filtered);

      setPredictedCommodity(selectedCommodity);
      setPredictedDate(selectedDate);
    } catch (err) {
      alert("Gagal mengambil data prediksi");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles().then((res) => setArticles(res.results || []));
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Konten Utama */}
        <div className={styles.mainContent}>
          <div className={styles.leftContent}>
            {/* Filter */}
            <div className={styles.topFilter}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Pilih Komoditas</label>
                <select
                  className={styles.inputField}
                  value={selectedCommodity}
                  onChange={handleCommodityChange}
                >
                  <option value="">Pilih Komoditas</option>
                  <option value="cabai">Cabai</option>
                  <option value="bawang_merah">Bawang Merah</option>
                  <option value="bawang_putih">Bawang Putih</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Pilih Tanggal Prediksi
                </label>
                <input
                  className={styles.inputField}
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={minDate}
                />
              </div>

              <div className={styles.buttonWrapper}>
                <button
                  className={styles.button}
                  onClick={async () => {
                    if (isLoadingChart) return;
                    setIsLoadingChart(true);
                    await handlePredict();
                    setIsLoadingChart(false);
                  }}
                  disabled={isLoadingChart}
                >
                  {isLoadingChart ? "Memuat..." : "Prediksi"}
                </button>
              </div>
            </div>

            {/* Chart Section */}
            <div
              className={styles.chartPlaceholder}
              style={{
                flexDirection: "column",
                alignItems: "stretch",
                position: "relative",
              }}
            >
              {/* ✅ Tagline Atas Chart, hanya muncul setelah klik Prediksi */}
              {predictedCommodity && (
                <h2 className={styles.chartTitle}>
                  Tampilan Grafik Harga Prediksi
                </h2>
              )}

              {/* ✅ Loading Screen */}
              {isLoadingChart && (
                <div className={styles.chartLoading}>
                  ⏳ Memuat prediksi grafik...
                </div>
              )}

              {/* ✅ Pesan Awal Sebelum Prediksi */}
              {!predictedCommodity || chartData.length <= 1 ? (
                <div className={styles.chartPlaceholderMessage}>
                  Silakan pilih komoditas dan tanggal yang ingin{" "}
                  <strong>diprediksi</strong>,
                  <br />
                  lalu klik <strong>Prediksi</strong> untuk melihat grafik
                  harga.
                </div>
              ) : (
                <>
                  {/* Card Ringkasan Harga */}
                  <div style={{}}>
                    <PriceSummaryCard
                      commodityName={predictedCommodity}
                      latestPrice={chartData[chartData.length - 1].harga}
                      previousPrice={chartData[chartData.length - 2].harga}
                      firstPrice={chartData[0].harga}
                      date={chartData[chartData.length - 1].name}
                    />
                  </div>

                  {/* Selector Day/Week/Month + Chart Type */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* Dropdown View Mode */}
                    <div className={styles.viewSelectorWrapper}>
                      <select
                        value={viewMode}
                        onChange={(e) =>
                          setViewMode(
                            e.target.value as "day" | "week" | "month"
                          )
                        }
                        className={styles.viewSelector}
                        style={{ backgroundColor: "#3D8D7A" }}
                      >
                        <option value="day">📅 Day</option>
                        <option value="week">📆 Week</option>
                        <option value="month">🗓️ Month</option>
                      </select>
                    </div>

                    {/* Chart Type Selector */}
                    <div className={styles.chartTypeWrapper}>
                      <button
                        onClick={() => setChartType("line")}
                        className={`${styles.chartTypeButton} ${
                          chartType === "line" ? styles.active : ""
                        }`}
                      >
                        📈 Line
                      </button>
                      <button
                        onClick={() => setChartType("bar")}
                        className={`${styles.chartTypeButton} ${
                          chartType === "bar" ? styles.active : ""
                        }`}
                      >
                        📊 Bar
                      </button>
                    </div>
                  </div>

                  {/* Chart Rendering */}
                  {(() => {
                    const aggregated = aggregateData(chartData, viewMode);
                    if (chartType === "line")
                      return <PriceChart data={aggregated} />;
                    if (chartType === "bar")
                      return <BarPriceChart data={aggregated} />;
                  })()}
                </>
              )}
              {/* Table */}
              <PredictionTable data={aggregateData(chartData, viewMode)} />
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* ✅ Artikel */}
            <div
              className={styles.sidebarItem}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* ✅ Loading Screen */}
              {articles.length === 0 ? (
                <div
                  style={{ textAlign: "center", marginTop: 20, color: "#777" }}
                >
                  Memuat artikel...
                </div>
              ) : (
                <>
                  {/* ✅ Tagline HANYA MUNCUL saat artikel tampil */}
                  <div className={styles.headerWrapper}>
                    <h2 className={styles.sectionTitle}>
                      Artikel Terkait Bahan Pangan dari Detik.com
                    </h2>
                    <div className={styles.underline} />
                  </div>

                  {/* ✅ Artikel */}
                  <Articles
                    articles={articles}
                    index={currentArticleIndex}
                    onNext={() =>
                      setCurrentArticleIndex((i) => (i + 1) % articles.length)
                    }
                    onPrev={() =>
                      setCurrentArticleIndex(
                        (i) => (i - 1 + articles.length) % articles.length
                      )
                    }
                  />
                </>
              )}
            </div>

            {/* Chatbot */}
            <div className={styles.sidebarItem1}>
              <div className={styles.chatbotWrapper}>
                <ChatBot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
