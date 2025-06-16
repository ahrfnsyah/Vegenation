// pages/login.tsx
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/lib/auth";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import styles from "@/styles/login.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      loginUser("secureToken123");
      router.push("/dashboard");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.overlay} />
        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.logoContainer}>
              <Image
                src="/icons/logo.png"
                alt="Logo"
                width={180}
                height={180}
                className={styles.logoImage}
              />
              <p className={styles.logoText}>VegeNation</p>
            </div>
          </div>

          <div className={styles.right}>
            <h2 className={styles.formTitle}>Log in</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <div className={styles.options}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />{" "}
                  Perlihatkan password
                </label>
                <a
                  href="#"
                  className={styles.forgot}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      "Silakan hubungi developer untuk mengetahui account Anda."
                    );
                  }}
                >
                  Lupa Password?
                </a>
              </div>
              <button type="submit" className={styles.button}>
                Log in
              </button>
              <Link href="/dashboard" className={styles.buttonSecondary}>
                Login as a Guest
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
