// src/components/Navbar/Navbar.tsx

import Link from "next/link";
import Image from "next/image";
import styles from "@/components/Navbar/navbar.module.css";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { getToken, logoutUser } from "@/lib/auth";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    // ✅ 3. APPLY DYNAMIC CLASS TO THE NAVBAR
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoContent}>
            <Image src="/icons/logo2.png" alt="Logo" width={30} height={30} />
            <span className={styles.logoText}>VegeNation</span>
          </div>
        </Link>
      </div>

      <div className={`${styles.links} ${isOpen ? styles.showMenu : ""}`}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/#articles">Articles</Link>
        <Link href="/#about">About</Link>

        {/* This part remains the same */}
        {router.pathname === "/dashboard" &&
          (isLoggedIn ? (
            <div className={styles.profileContainer} ref={dropdownRef}>
              <Image
                src="/icons/profile.png"
                alt="Profile"
                width={32}
                height={32}
                className={styles.profileImage}
                onClick={toggleDropdown}
                style={{ cursor: "pointer" }}
              />
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/profile");
                    }}
                  >
                    Profile Account
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.logoutContainer}>
              <Image
                src="/icons/logout.png"
                alt="Logout"
                width={28}
                height={28}
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/")}
              />
            </div>
          ))}
      </div>

      <button className={styles.burger} onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
}
