import { useState } from 'react';
import { TextNote } from '../TextNote/TextNote';
import { ImageEmbed } from '../ImageEmbed/ImageEmbed';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';
import { Plus, FileText, Youtube, Image as ImageIcon } from 'lucide-react';
import styles from './DailyCanvas.module.css';

interface Props {
  date: string;
}

export function DailyCanvas({ date }: Props) {
  const [elements, setElements] = useState<any[]>([]);
  const [theme, setTheme] = useState<'white' | 'grid' | 'dark' | 'paper'>('white');
  const [menuOpen, setMenuOpen] = useState(false);

  const addElement = (type: string) => {
    setElements([...elements, { type }]);
    setMenuOpen(false);
  };

  return (
    <div className={`${styles.canvasBlock} ${styles[theme]}`}>
      <div className={styles.canvasHeader}>
        <h2 className={styles.canvasTitle}>{date}</h2>
        <select className={styles.themeSelector} value={theme} onChange={(e) => setTheme(e.target.value as any)}>
          <option value="white">White</option>
          <option value="grid">Grid</option>
          <option value="dark">Dark</option>
          <option value="paper">Paper</option>
        </select>
      </div>

      <div className={styles.elementsContainer}>
        {elements.map((el, i) => {
          if (el.type === 'text') return <TextNote key={i} index={i} />;
          if (el.type === 'image') return <ImageEmbed key={i} index={i} />;
          if (el.type === 'youtube') return <YoutubeEmbed key={i} index={i} />;
          return null;
        })}
      </div>

      <div className={styles.fabWrapper}>
        <button className={styles.fab} onClick={() => setMenuOpen(!menuOpen)}>
          <Plus size={24} />
        </button>
        {menuOpen && (
          <div className={styles.fabMenu}>
            <button onClick={() => addElement('text')}><FileText size={20} /></button>
            <button onClick={() => addElement('youtube')}><Youtube size={20} /></button>
            <button onClick={() => addElement('image')}><ImageIcon size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
}