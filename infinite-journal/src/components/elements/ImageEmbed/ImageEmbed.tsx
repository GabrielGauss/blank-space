import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageEmbed.module.css';

interface Props {
  index: number;
  onDelete?: () => void;
}

export function ImageEmbed({ index, onDelete }: Props) {
  const [url, setUrl] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleConfirm = () => {
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
              placeholder="Paste image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleConfirm}
              className={styles.input}
            />
          )}
          {confirmed && url && (
            <div className={styles.previewWrapper}>
              <img src={url} alt={`Image ${index + 1}`} className={styles.image} />
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