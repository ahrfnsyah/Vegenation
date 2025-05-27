import React, { useEffect, useRef, useState } from 'react';
import styles from '@/components/Chatbot/chatbot.module.css';
import { sendChatMessage } from '@/lib/api';
import Image from 'next/image';

const ChatBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'bot'; message: string }[]>([
    {
      type: 'bot',
      message: 'Hai! Saya Vegebot, siap memberikan prediksi harga sayur untuk Anda. Sayur apa yang ingin Anda ketahui harganya?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const [emptyError, setEmptyError] = useState(false);
  const [userHasAsked, setUserHasAsked] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Pindahkan handleScroll ke luar
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 20;
    setShouldScroll(isAtBottom);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') {
      setEmptyError(true);
      setTimeout(() => setEmptyError(false), 2000);
      return;
    }

    setEmptyError(false);
    setUserHasAsked(true);

    const userMessage = inputMessage.trim();
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setInputMessage('');
    setLoading(true);
    setTypingDots('.');

    // Placeholder pesan bot kosong
    setChatHistory(prev => [...prev, { type: 'bot', message: '' }]);

    const dotsInterval = setInterval(() => {
      setTypingDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);


    try {
      const data = await sendChatMessage(userMessage);

      const formatResponse = (response: string): string => {
        return response
          .split('\n')
          .map(line => {
            const match = line.match(/^(\d{1,2} \w+ \d{4}): Rp([\d.,]+)/);
            if (match) {
              return `${match[1]}: Rp${match[2]}/kg`;
            }
            return line;
          })
          .join('\n');
      };

      setTimeout(() => {
        clearInterval(dotsInterval);
        setTypingDots('');
        setChatHistory(prev => {
          const updated = [...prev];
          const formattedMessage = formatResponse(data.response || 'Tidak ada jawaban.');
          updated[updated.length - 1] = { type: 'bot', message: formattedMessage };
          return updated;
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      clearInterval(dotsInterval);
      setTypingDots('');
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'bot', message: 'Maaf, terjadi kesalahan.' };
        return updated;
      });
      setLoading(false);
      console.error('Chatbot error:', error);
    }
  };

  useEffect(() => {
    if (shouldScroll) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, typingDots, shouldScroll]);

  return (
    <div className={styles.chatContainer}>
      <div
        ref={chatContainerRef}
        className={styles.chatMessages}
        onScroll={handleScroll}
      >
        {!userHasAsked && <div className={styles.helpText}>Chatbot</div>}
        {chatHistory.map((chat, i) => (
          <div
            key={i}
            className={chat.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper}
          >
            {chat.type === 'bot' && (
              <Image
                src="/icons/imas5.png"
                alt="Vegebot"
                width={28}
                height={28}
                className={styles.botAvatar}
              />
            )}
            <div
              className={chat.type === 'user' ? styles.userMessage : styles.botMessage}
            >
              {chat.message || (loading && i === chatHistory.length - 1 ? typingDots : '')}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.chatInputArea}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Tulis pertanyaan..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          className={styles.sendButton}
          disabled={loading}
        >
          {loading ? '...' : 'Kirim'}
        </button>
      </div>

      {emptyError && (
        <div className={styles.errorMessage}>Silakan tulis pertanyaan terlebih dahulu</div>
      )}
    </div>
  );
};

export default ChatBot;
