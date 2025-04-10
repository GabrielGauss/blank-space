import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import styles from './YoutubeEmbed.module.css';

interface Props {
  index: number;
  position?: { x: number; y: number };
  updatePosition?: (index: number, x: number, y: number) => void;
  tileRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const SNAP_THRESHOLD = 15;

export function YoutubeEmbed({ index, position, updatePosition, tileRefs }: Props) {
  const [url, setUrl] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const confirmUrl = () => {
    if (url.trim()) setConfirmed(true);
  };

  const getEmbedUrl = (link: string): string => {
    try {
      const urlObj = new URL(link);

      if (urlObj.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }

      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }

      if (urlObj.pathname.includes('/embed/')) {
        return link;
      }
    } catch {
      return '';
    }

    return '';
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
        x: position?.x ?? 160 + index * 30,
        y: position?.y ?? 100 + index * 30,
        width: 400,
        height: 225,
      }}
      lockAspectRatio={16 / 9}
      bounds="parent"
      minWidth={280}
      minHeight={158}
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
            placeholder="Paste YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={confirmUrl}
            className={styles.input}
          />
        ) : (
          <div className={styles.previewWrapper}>
            <iframe
              className={styles.iframe}
              src={getEmbedUrl(url)}
              title={`YouTube video ${index + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </motion.div>
    </Rnd>
  );
}
