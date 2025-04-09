import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextNote } from '../TextNote/TextNote';
import { ImageEmbed } from '../ImageEmbed/ImageEmbed';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';
import {
  Plus, FileText, Youtube, Image as ImageIcon, Pencil,
  Copy, Maximize2, Palette, Trash2
} from 'lucide-react';
import styles from './DailyCanvas.module.css';

interface Props {
  date: string;
}

export function DailyCanvas({ date }: Props) {
  const [elements, setElements] = useState<any[]>([]);
  const [theme, setTheme] = useState<'white' | 'grid' | 'dark' | 'paper'>('white');
  const [menuOpen, setMenuOpen] = useState(false);
  const [controlMenuIndex, setControlMenuIndex] = useState<number | null>(null);

  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        controlMenuIndex !== null &&
        tileRefs.current[controlMenuIndex] &&
        !tileRefs.current[controlMenuIndex]?.contains(e.target as Node)
      ) {
        setControlMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [controlMenuIndex]);

  const addElement = (type: string) => {
    const newElements = [...elements, { type, size: 'sm', color: 'default', emoji: '' }];
    setElements(newElements);
    setControlMenuIndex(newElements.length - 1);
    setMenuOpen(false);
  };

  const deleteElement = (i: number) => {
    const updated = [...elements];
    updated.splice(i, 1);
    setElements(updated);
  };

  const duplicateElement = (i: number) => {
    const clone = [...elements];
    clone.splice(i + 1, 0, { ...clone[i] });
    setElements(clone);
  };

  const resizeElement = (i: number) => {
    const updated = [...elements];
    const current = updated[i];
    updated[i] = {
      ...current,
      size: current.size === 'lg' ? 'sm' : current.size === 'md' ? 'lg' : 'md',
    };
    setElements(updated);
  };

  const toggleColor = (i: number) => {
    const updated = [...elements];
    const current = updated[i];
    const nextColor =
      current.color === 'yellow'
        ? 'blue'
        : current.color === 'blue'
        ? 'green'
        : current.color === 'green'
        ? 'pink'
        : 'yellow';
    updated[i] = { ...current, color: nextColor };
    setElements(updated);
  };

  const renderElement = (el: any, i: number) => {
    const commonProps = { index: i, onDelete: () => deleteElement(i) };

    const sizeMap = {
      sm: styles.tileSm,
      md: styles.tileMd,
      lg: styles.tileLg,
    };

    const colorMap = {
      yellow: styles.bgYellow,
      blue: styles.bgBlue,
      green: styles.bgGreen,
      pink: styles.bgPink,
      default: '',
    };

    const sizeClass = sizeMap[el.size] || styles.tileSm;
    const colorClass = colorMap[el.color] || '';

    const content =
      el.type === 'text' ? <TextNote {...commonProps} /> :
      el.type === 'image' ? <ImageEmbed {...commonProps} /> :
      el.type === 'youtube' ? <YoutubeEmbed {...commonProps} /> :
      null;

    const showControls = controlMenuIndex === i;
    const controlPosition = i % 2 === 0 ? styles.controlLeft : styles.controlRight;

    return (
      <div
        key={i}
        ref={(el) => (tileRefs.current[i] = el)}
        className={`${styles.tile} ${sizeClass} ${colorClass}`}
      >
        <div className={styles.tileMeta}>
          {controlMenuIndex === i ? (
            <input
              className={styles.emojiInput}
              maxLength={2}
              placeholder="😄"
              value={el.emoji}
              onChange={(e) => {
                const updated = [...elements];
                updated[i].emoji = e.target.value;
                setElements(updated);
              }}
              autoFocus
            />
          ) : (
            <span className={styles.emoji}>{el.emoji}</span>
          )}

          <div className={styles.pencilActions}>
            <button
              className={styles.pencilToggle}
              onClick={() => setControlMenuIndex(controlMenuIndex === i ? null : i)}
              title="Edit block"
            >
              <Pencil size={16} />
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => deleteElement(i)}
              title="Delete block"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              className={`${styles.tileFabMenu} ${controlPosition}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={() => duplicateElement(i)} title="Duplicate"><Copy size={14} /></button>
              <button onClick={() => resizeElement(i)} title="Resize"><Maximize2 size={14} /></button>
              <button onClick={() => toggleColor(i)} title="Color"><Palette size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {content}
      </div>
    );
  };

  return (
    <div className={`${styles.canvasBlock} ${styles[theme]}`}>
      <div className={styles.canvasHeader}>
        <h2 className={styles.canvasTitle}>{date}</h2>
        <select
          className={styles.themeSelector}
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
        >
          <option value="white">White</option>
          <option value="grid">Grid</option>
          <option value="dark">Dark</option>
          <option value="paper">Paper</option>
        </select>
      </div>

      <div className={styles.elementsContainer}>{elements.map(renderElement)}</div>

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
