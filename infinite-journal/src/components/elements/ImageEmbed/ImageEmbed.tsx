import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import styles from './ImageEmbed.module.css';

interface Props {
  index: number;
  position?: { x: number; y: number };
  updatePosition?: (index: number, x: number, y: number) => void;
  tileRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const SNAP_THRESHOLD = 15;

export function ImageEmbed({ index, position, updatePosition, tileRefs }: Props) {
  const [url, setUrl] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (url.trim()) setConfirmed(true);
  };

  const handleDragStop = (e: any, d: any) => {
    let finalX = d.x;
    let finalY = d.y;

    tileRefs?.current.forEach((el, i) => {
      if (i === index || !el) return;
      const rect = el.getBoundingClientRect();
      if (Math.abs(rect.left - d.x) < SNAP_THRESHOLD) finalX = rect.left;
      if (Math.abs(rect.top - d.y) < SNAP_THRESHOLD) finalY = rect.top;
    });

    updatePosition?.(index, finalX, finalY);
  };

  return (
    <Rnd
      default={{
        x: position?.x ?? 120 + index * 30,
        y: position?.y ?? 80 + index * 30,
        width: 320,
        height: 240,
      }}
      bounds="parent"
      minWidth={150}
      minHeight={120}
      className={styles.rndWrapper}
      onDragStop={handleDragStop}
    >
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {!confirmed ? (
          <input
            type="text"
            placeholder="Paste image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleConfirm}
            className={styles.input}
          />
        ) : (
          <div className={styles.previewWrapper}>
            <img src={url} alt={`Image ${index + 1}`} className={styles.image} />
          </div>
        )}
      </motion.div>
    </Rnd>
  );
}
