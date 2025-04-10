import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Corrected import path for TextNote
import TextNote from '../TextNote/TextNote';
import { ImageEmbed } from '../ImageEmbed/ImageEmbed';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';
import {
  Plus,
  FileText,
  Youtube,
  Image as ImageIcon,
  Pencil,
  Copy,
  Maximize2,
  Palette,
  Trash2,
} from 'lucide-react';
import styles from './DailyCanvas.module.css';

interface Props {
  date: string;
}

// Define the type for a single element in the canvas
interface CanvasElement {
  type: 'text' | 'image' | 'youtube';
  size: 'sm' | 'md' | 'lg';
  color: 'default' | 'yellow' | 'blue' | 'green' | 'pink';
  emoji: string;
  // Add a text property to hold the text content for TextNote
  text?: string;
}

// DailyCanvas component to display and manage interactive elements
export function DailyCanvas({ date }: Props) {
  // State to manage the array of elements in the canvas
  const [elements, setElements] = useState<CanvasElement[]>([]);
  // State to manage the current theme of the canvas
  const [theme, setTheme] = useState<'grid' | 'white' | 'dark' | 'paper'>('grid');
  // State to control the visibility of the add element menu
  const [menuOpen, setMenuOpen] = useState(false);
  // State to track the index of the element whose control menu is open
  const [controlMenuIndex, setControlMenuIndex] = useState<number | null>(null);

  // Ref to store the DOM nodes of each tile, used for detecting outside clicks
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // useEffect hook to handle clicks outside the control menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if a control menu is open and if the click target is outside the current tile
      if (
        controlMenuIndex !== null &&
        tileRefs.current[controlMenuIndex] &&
        !tileRefs.current[controlMenuIndex]?.contains(e.target as Node)
      ) {
        // Close the control menu if the click is outside
        setControlMenuIndex(null);
      }
    };
    // Add event listener for mousedown on the document
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up the event listener when the component unmounts or controlMenuIndex changes
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [controlMenuIndex]);

  // Function to add a new element to the canvas
  const addElement = (type: 'text' | 'image' | 'youtube') => {
    // Create a new element with default properties
    const newElement: CanvasElement = { type, size: 'sm', color: 'default', emoji: '' };
    // If it's a text note, initialize with empty text
    if (type === 'text') {
      newElement.text = '';
    }
    // Update the elements state with the new element
    const newElements = [...elements, newElement];
    setElements(newElements);
    // Open the control menu for the newly added element
    setControlMenuIndex(newElements.length - 1);
    // Close the add element menu
    setMenuOpen(false);
  };

  // Function to delete an element from the canvas
  const deleteElement = (index: number) => {
    // Create a copy of the elements array
    const updatedElements = [...elements];
    // Remove the element at the specified index
    updatedElements.splice(index, 1);
    // Update the elements state
    setElements(updatedElements);
    // If the deleted element's control menu was open, close it
    if (controlMenuIndex === index) {
      setControlMenuIndex(null);
    }
  };

  // Function to duplicate an element in the canvas
  const duplicateElement = (index: number) => {
    // Create a copy of the elements array
    const clonedElements = [...elements];
    // Insert a copy of the element at the next index
    clonedElements.splice(index + 1, 0, { ...clonedElements[index] });
    // Update the elements state
    setElements(clonedElements);
  };

  // Function to resize an element in the canvas
  const resizeElement = (index: number) => {
    // Create a copy of the elements array
    const updatedElements = [...elements];
    // Get the current element
    const currentElement = updatedElements[index];
    // Cycle through the possible sizes
    let newSize: 'sm' | 'md' | 'lg' = 'sm';
    if (currentElement.size === 'sm') {
      newSize = 'md';
    } else if (currentElement.size === 'md') {
      newSize = 'lg';
    } else if (currentElement.size === 'lg') {
      newSize = 'sm';
    }
    // Update the size of the element
    updatedElements[index] = { ...currentElement, size: newSize };
    // Update the elements state
    setElements(updatedElements);
  };

  // Function to toggle the color of an element in the canvas
  const toggleColor = (index: number) => {
    // Create a copy of the elements array
    const updatedElements = [...elements];
    // Get the current element
    const currentElement = updatedElements[index];
    // Cycle through the possible colors
    let nextColor: 'yellow' | 'blue' | 'green' | 'pink' = 'yellow';
    if (currentElement.color === 'yellow') {
      nextColor = 'blue';
    } else if (currentElement.color === 'blue') {
      nextColor = 'green';
    } else if (currentElement.color === 'green') {
      nextColor = 'pink';
    } else if (currentElement.color === 'pink') {
      nextColor = 'yellow';
    }
    // Update the color of the element
    updatedElements[index] = { ...currentElement, color: nextColor };
    // Update the elements state
    setElements(updatedElements);
  };

  // Function to handle text changes within a TextNote component
  const handleTextNoteChange = (index: number, newText: string) => {
    const updatedElements = [...elements];
    if (updatedElements[index] && updatedElements[index].type === 'text') {
      updatedElements[index].text = newText;
      setElements(updatedElements);
    }
  };

  // Function to render a single element based on its type
  const renderElement = (el: CanvasElement, index: number) => {
    // Common props to pass to the embedded components
    const commonProps = {
      index,
      onDelete: () => deleteElement(index),
      // Pass the handleTextNoteChange function to TextNote
      onTextChange: el.type === 'text' ? handleTextNoteChange : undefined,
      // Pass the current text content to TextNote
      initialText: el.type === 'text' ? el.text : undefined,
    };

    // Mapping of size values to CSS class names
    const sizeMap = {
      sm: styles.tileSm,
      md: styles.tileMd,
      lg: styles.tileLg,
    };

    // Mapping of color values to CSS class names
    const colorMap = {
      yellow: styles.bgYellow,
      blue: styles.bgBlue,
      green: styles.bgGreen,
      pink: styles.bgPink,
      default: '',
    };

    // Determine the CSS classes based on the element's size and color
    const sizeClass = sizeMap[el.size] || styles.tileSm;
    const colorClass = colorMap[el.color] || '';

    // Render the appropriate component based on the element's type
    const content =
      el.type === 'text' ? <TextNote {...commonProps} /> :
      el.type === 'image' ? <ImageEmbed {...commonProps} /> :
      el.type === 'youtube' ? <YoutubeEmbed {...commonProps} /> :
      null;

    // Check if the control menu should be shown for this element
    const showControls = controlMenuIndex === index;
    // Determine the position of the control menu (left or right) based on the index
    const controlPosition = index % 2 === 0 ? styles.controlLeft : styles.controlRight;

    return (
      <div
        key={index}
        // Set the ref for this tile for outside click detection
        ref={(ref) => (tileRefs.current[index] = ref)}
        className={`${styles.tile} ${sizeClass} ${colorClass}`}
      >
        {/* Meta information for the tile (emoji and pencil actions) */}
        <div className={styles.tileMeta}>
          {/* Input for editing emoji if the control menu is open */}
          {controlMenuIndex === index ? (
            <input
              className={styles.emojiInput}
              maxLength={2}
              placeholder="😄"
              value={el.emoji}
              onChange={(e) => {
                const updatedElements = [...elements];
                updatedElements[index].emoji = e.target.value;
                setElements(updatedElements);
              }}
              autoFocus
            />
          ) : (
            // Display the emoji if the control menu is closed
            <span className={styles.emoji}>{el.emoji}</span>
          )}

          {/* Pencil icon to toggle the control menu and delete button */}
          <div className={styles.pencilActions}>
            <button
              className={styles.pencilToggle}
              onClick={() => setControlMenuIndex(controlMenuIndex === index ? null : index)}
              title="Edit block"
            >
              <Pencil size={16} />
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => deleteElement(index)}
              title="Delete block"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Control menu that appears with animation */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className={`${styles.tileFabMenu} ${controlPosition}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={() => duplicateElement(index)} title="Duplicate"><Copy size={14} /></button>
              <button onClick={() => resizeElement(index)} title="Resize"><Maximize2 size={14} /></button>
              <button onClick={() => toggleColor(index)} title="Color"><Palette size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render the content of the element */}
        {content}
      </div>
    );
  };

  return (
    <div className={`${styles.canvasBlock} ${styles[theme]}`}>
      {/* Header of the canvas with date, title, mood, and theme selector */}
      <div className={styles.canvasHeader}>
        <div className={styles.dateTitleRow}>
          {/* Format the date as DD-MM-YYYY */}
          <h2 className={styles.canvasTitle}>
            {new Date(date).toLocaleDateString('en-GB')}
          </h2>

          {/* Input fields for entry title and mood */}
          <div className={styles.entryMeta}>
            <input
              type="text"
              className={styles.entryTitle}
              placeholder="Your title..."
            />
            <input
              type="text"
              className={styles.moodInput}
              maxLength={2}
              placeholder="😄"
            />
          </div>
        </div>

        {/* Theme selector dropdown */}
        <select
          className={styles.themeSelector}
          value={theme}
          // Removed the "as any" type assertion
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="grid">Grid</option>
          <option value="white">White</option>
          <option value="dark">Dark</option>
          <option value="paper">Paper</option>
        </select>
      </div>

      {/* Container for the dynamically rendered elements */}
      <div className={styles.elementsContainer}>{elements.map(renderElement)}</div>

      {/* Floating action button to open the add element menu */}
      <div className={styles.fabWrapper}>
        <button className={styles.fab} onClick={() => setMenuOpen(!menuOpen)}>
          <Plus size={24} />
        </button>
        {/* Add element menu with different element types */}
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