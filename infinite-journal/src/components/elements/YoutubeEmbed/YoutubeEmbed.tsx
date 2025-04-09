import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './YoutubeEmbed.module.css';

interface Props {
  index: number;
  onDelete?: () => void;
}

export function YoutubeEmbed({ index, onDelete }: Props) {
  const [url, setUrl] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [visible, setVisible] = useState(true);

  const getEmbedUrl = (link: string) => {
    const videoId = link.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const confirmUrl = () => {
    if (url) setConfirmed(true);
  };

  const handleDelete = () => {
    setVisible(false);
    setTimeout(() => onDelete?.(), 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {!confirmed && (
            <input
              type="text"
              placeholder="Paste YouTube URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={confirmUrl}
              className={styles.input}
            />
          )}
          {confirmed && url && (
            <div className={styles.previewWrapper}>
              <iframe
                className={styles.iframe}
                height="315"
                src={getEmbedUrl(url)}
                title={`YouTube video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {onDelete && (
                <button className={styles.deleteButton} onClick={handleDelete}><X size={16} /></button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}