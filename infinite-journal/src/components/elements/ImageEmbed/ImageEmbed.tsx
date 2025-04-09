import { useState } from 'react';
import styles from './ImageEmbed.module.css';

interface Props {
  index: number;
}

export function ImageEmbed({ index }: Props) {
  const [url, setUrl] = useState('');

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Paste image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={styles.input}
      />
      {url && <img src={url} alt={`Image ${index + 1}`} className={styles.image} />}
    </div>
  );
}