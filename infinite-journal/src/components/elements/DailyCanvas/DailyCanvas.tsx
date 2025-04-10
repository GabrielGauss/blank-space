import { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Youtube, Image as ImageIcon, Pencil } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import TextNote from '../TextNote/TextNote';
import { ImageEmbed } from '../ImageEmbed/ImageEmbed';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';
import EditDropdown from '../../EditDropdown/EditDropdown';
import styles from './DailyCanvas.module.css';

interface Props {
  date: string;
}

interface CanvasElement {
  type: 'text' | 'image' | 'youtube';
  size: 'sm' | 'md' | 'lg';
  color: 'default' | 'yellow' | 'blue' | 'green' | 'pink';
  text?: string;
  position?: { x: number; y: number };
}

export function DailyCanvas({ date }: Props) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [theme, setTheme] = useState<'grid' | 'white' | 'dark' | 'paper'>('grid');
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

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      type,
      size: 'sm',
      color: 'default',
      text: type === 'text' ? '' : undefined,
      position: {
        x: 100 + elements.length * 40,
        y: 100 + elements.length * 40,
      }
    };
    setElements([...elements, newElement]);
    setControlMenuIndex(elements.length);
    setMenuOpen(false);
  };

  const deleteElement = (index: number) => {
    const updated = [...elements];
    updated.splice(index, 1);
    setElements(updated);
    setControlMenuIndex(null);
  };

  const setColor = (index: number, color: CanvasElement['color']) => {
    const updated = [...elements];
    updated[index].color = color;
    setElements(updated);
  };

  const updateElementPosition = (index: number, x: number, y: number) => {
    const updated = [...elements];
    updated[index].position = { x, y };
    setElements(updated);
  };

  const handleTextNoteChange = (index: number, newText: string) => {
    const updated = [...elements];
    if (updated[index].type === 'text') {
      updated[index].text = newText;
      setElements(updated);
    }
  };

  const renderElement = (el: CanvasElement, index: number) => {
    const commonProps = {
      index,
      position: el.position,
      updatePosition: updateElementPosition,
      tileRefs,
      initialText: el.type === 'text' ? el.text : undefined,
      onTextChange: el.type === 'text' ? handleTextNoteChange : undefined,
    };

    const showControls = controlMenuIndex === index;

    return (
      <div
        key={index}
        ref={(el) => (tileRefs.current[index] = el)}
        className={`${styles.tile} ${styles[`bg${el.color.charAt(0).toUpperCase() + el.color.slice(1)}`]}`}
      >
        {/* Floating edit button + dropdown */}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <button
            onClick={() => setControlMenuIndex(showControls ? null : index)}
            className={styles.pencilToggle}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <AnimatePresence>
            {showControls && (
              <EditDropdown
                onColorChange={(color) => setColor(index, color)}
                onDelete={() => deleteElement(index)}
              />
            )}
          </AnimatePresence>
        </div>

        {el.type === 'text' && <TextNote {...commonProps} />}
        {el.type === 'image' && <ImageEmbed {...commonProps} />}
        {el.type === 'youtube' && <YoutubeEmbed {...commonProps} />}
      </div>
    );
  };

  return (
    <div className={`${styles.canvasBlock} ${styles[theme] ?? ''}`}>
      <div className={styles.canvasHeader}>
        <div className={styles.dateTitleRow}>
          <h2 className={styles.canvasTitle}>
            {new Date(date).toLocaleDateString('en-GB')}
          </h2>
          <div className={styles.entryMeta}>
            <input
              type="text"
              className={styles.entryTitle}
              placeholder="Your title..."
            />
          </div>
        </div>

        <select
          className={styles.themeSelector}
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
        >
          <option value="grid">Grid</option>
          <option value="white">White</option>
          <option value="dark">Dark</option>
          <option value="paper">Paper</option>
        </select>
      </div>

      <div className={styles.elementsContainer}>
        {elements.map(renderElement)}
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
