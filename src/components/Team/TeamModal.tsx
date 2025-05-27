import Image from 'next/image';
import styles from '@/components/Team/teammodal.module.css';
import { FaLinkedin, FaGithub, FaInstagram, FaTimes } from 'react-icons/fa';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

interface TeamModalProps {
  show: boolean;
  onClose: () => void;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ummu Athiya',
    role: 'Project Manager',
    image: '/images/ummu.png',
    linkedin: 'https://www.linkedin.com/in/ummu-athiya-833b541b7/',
    github: 'https://github.com/titii-ship-it',
    instagram: 'https://www.instagram.com/athiyawn/',
  },
  {
    name: 'Hibban Wijaya Gymnastiar',
    role: 'Data Analyst',
    image: '/images/hibban.png',
    linkedin: 'https://www.linkedin.com/in/hibban-wijaya-gymnastiar-144543358/',
    github: 'https://github.com/hibbastiar',
    instagram: 'https://www.instagram.com/hibban_wijayaa/',
  },
   {
    name: 'Rayhan Safar Dwiliano Putra',
    role: 'Back-end Developer',
    image: '/images/rayhan.png',
    linkedin: 'https://www.linkedin.com/in/rayhan-safar-putra-dwiliano/',
    github: 'https://github.com/rayhansfr',
    instagram: 'https://www.instagram.com/rayhansfr/',
  },
  {
    name: 'Achmad Husein Rifansyah',
    role: 'Front-End Developer',
    image: '/images/husein.png',
    linkedin: 'https://www.linkedin.com/in/achmad-husein-rifansyah-a0463b299/',
    github: 'https://github.com/ahrfnsyah',
    instagram: 'https://www.instagram.com/ahrfnsyah/',
  }
];

export default function TeamModal({ show, onClose }: TeamModalProps) {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
  <div className={styles.modalContent}>
    {/* Tambahkan tombol silang */}
    <span className={styles.closeIcon} onClick={onClose}>
      <FaTimes />
    </span>

    <h3 className={styles.teamTitle}>Tim Pengembang</h3>
    <div className={styles.teamGrid}>
      {teamMembers.map((member, index) => (
        <div className={styles.teamCard} key={index}>
          <Image
            src={member.image}
            alt={member.name}
            width={120}
            height={120}
            className={styles.profileImage}
          />
          <h4>{member.name}</h4>
          <p>{member.role}</p>
          <div className={styles.socialIcons}>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            )}
            {member.instagram && (
              <a href={member.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}
