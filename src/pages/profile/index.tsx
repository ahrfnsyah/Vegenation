import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/profile.module.css';
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';

interface UserProfile {
  nama: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    nama: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
  });

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!user.email.endsWith('@gmail.com')) {
      alert('Email harus menggunakan domain @gmail.com');
      return;
    }

    if (isNaN(Number(user.postalCode))) {
      alert('Kode pos harus berupa angka.');
      return;
    }

    if (!/^\d+$/.test(user.phone)) {
      alert('Nomor telepon hanya boleh angka.');
      return;
    }

    localStorage.setItem('userProfile', JSON.stringify(user));
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm('Apakah Anda yakin ingin mereset profil Anda? Semua data akan dihapus.');
    if (confirmReset) {
      localStorage.removeItem('userProfile');
      setUser({
        nama: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
      });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

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
            <div className={styles.profileHeader}>
              <Image
                src="/icons/logo.png"
                alt="Avatar"
                width={100}
                height={100}
                className={styles.avatar}
              />
              <div className={styles.profileName}>{user.nama || 'Nama User'}</div>
              <div className={styles.profileLocation}>{user.address || 'Your location'}</div>
            </div>
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                handleEditToggle();
              }}
            >
              <div>
                <label>Nama*</label>
                <input
                  type="text"
                  name="nama"
                  value={user.nama}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>No Telepon*</label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Kode Pos</label>
                <input
                  type="tel"
                  name="postalCode"
                  value={user.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.fullWidth}>
                <label>Alamat</label>
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.buttonRow}>
                <button type="submit" className={styles.saveBtn}>
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button type="button" onClick={handleReset} className={styles.resetBtn}>
                  Reset Profile
                </button>
              </div>

            </form>
          </main>
        </div>
      </div>
    </>
  );
}
