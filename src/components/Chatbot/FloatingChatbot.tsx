import React, { useState } from 'react';
import ChatBot from '@/components/Chatbot/Chatbot';
import styles from '@/components/Chatbot/floatingChatbot.module.css';
import Image from 'next/image';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(prev => !prev);

  return (
    <div className={styles.floatingContainer}>
      {isOpen && (
        <div className={styles.chatbotBox}>
          <ChatBot />
        </div>
      )}

     <button onClick={toggleChat} className={styles.chatbotToggle}>
  <div className={styles.iconWrapper}>
    <Image
      src="/icons/imasbook.png"
      alt="Chatbot"
      fill
      className={styles.chatbotIcon}
    />
  </div>
</button>

    </div>
  );
};

export default FloatingChatbot;
