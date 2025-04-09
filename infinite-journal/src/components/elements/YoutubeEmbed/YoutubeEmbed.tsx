import { useState } from 'react';
import styles from './YoutubeEmbed.module.css';

interface Props {
  index: number;
}

export function YoutubeEmbed({ index }: Props) {
  const [url, setUrl] = useState('');

  const getEmbedUrl = (link: string) => {
    const videoId = link.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={styles.input}
      />
      {url && (
        <iframe
          className={styles.iframe}
          height="315"
          src={getEmbedUrl(url)}
          title={`YouTube video ${index + 1}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}