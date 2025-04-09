import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TextNote.module.css';

interface Props {
  index: number;
  onDelete?: () => void;
}

export function TextNote({ index, onDelete }: Props) {
  const [visible, setVisible] = useState(true);

  const handleDelete = () => {
    setVisible(false);
    setTimeout(() => onDelete?.(), 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            className={styles.textarea}
            placeholder={`Write something for note ${index + 1}...`}
            rows={4}
          />
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}