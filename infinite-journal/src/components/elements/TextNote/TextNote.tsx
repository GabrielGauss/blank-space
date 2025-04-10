import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './TextNote.module.css'; // Ensure this CSS module exists

// Define the Props interface for the TextNote component
interface Props {
  index: number;
  // Optional prop to receive initial text content
  initialText?: string;
  // Optional prop to handle text changes externally
  onTextChange?: (index: number, newText: string) => void;
}

// TextNote component: A resizable text area for notes
const TextNote = ({ index, initialText = '', onTextChange }: Props) => {
  // State to manage the text content of the textarea
  const [text, setText] = useState(initialText);
  // Ref to the textarea DOM element for direct manipulation
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // State to manage text formatting options
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  // Auto-resize textarea on mount and when text changes
  useEffect(() => {
    resizeTextarea();
  }, [text]);

  // Update local state when initialText prop changes (for controlled components)
  useEffect(() => {
    if (initialText !== undefined && initialText !== text) {
      setText(initialText);
      // Trigger resize again in case initial text is long
      resizeTextarea();
    }
  }, [initialText, text]);

  // Function to dynamically resize the textarea based on its content
  const resizeTextarea = () => {
    if (textareaRef.current) {
      // Reset the height to 'auto' to allow scrollHeight to be accurate
      textareaRef.current.style.height = 'auto';
      // Set the height to the scrollHeight, effectively fitting the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Function to handle changes in the textarea input
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    // Update the local state
    setText(newText);
    // Call the external onTextChange handler if provided
    if (onTextChange) {
      onTextChange(index, newText);
    }
    // Resize the textarea immediately as the text changes
    resizeTextarea();
  };

  // Functions to toggle text formatting options
  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
  };

  const toggleStrikethrough = () => {
    setIsStrikethrough(!isStrikethrough);
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Optional Toolbar for Text Formatting */}
      <div className={styles.toolbar}>
        <button type="button" onClick={toggleBold} className={isBold ? styles.active : ''}>
          B
        </button>
        <button type="button" onClick={toggleItalic} className={isItalic ? styles.active : ''}>
          <em style={{ fontStyle: 'italic' }}>I</em>
        </button>
        <button type="button" onClick={toggleUnderline} className={isUnderline ? styles.active : ''}>
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>
        <button type="button" onClick={toggleStrikethrough} className={isStrikethrough ? styles.active : ''}>
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>
        {/* Add more formatting options here */}
      </div>
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} ${isBold ? styles.bold : ''} ${
          isItalic ? styles.italic : ''
        } ${isUnderline ? styles.underline : ''} ${
          isStrikethrough ? styles.strikethrough : ''
        }`}
        placeholder={`Write something for note ${index + 1}...`}
        value={text}
        onChange={handleTextChange}
        rows={4} // Initial number of visible rows
      />
    </motion.div>
  );
};

export default TextNote;