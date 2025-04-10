import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import styles from './TextNote.module.css';

interface Props {
  index: number;
  initialText?: string;
  onTextChange?: (index: number, newText: string) => void;
  position?: { x: number; y: number };
  updatePosition?: (index: number, x: number, y: number) => void;
  tileRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const SNAP_THRESHOLD = 15;

const TextNote = ({ index, initialText = '', onTextChange, position, updatePosition, tileRefs }: Props) => {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    onTextChange?.(index, newText);
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
      default={{ x: position?.x || 100, y: position?.y || 100, width: 260, height: 200 }}
      bounds="parent"
      minWidth={180}
      minHeight={140}
      className={styles.rndWrapper}
      onDragStop={handleDragStop}
    >
      <motion.div className={styles.wrapper}>
        <div className={styles.toolbar}>
          <button onClick={() => setIsBold(!isBold)} className={isBold ? styles.active : ''}>B</button>
          <button onClick={() => setIsItalic(!isItalic)} className={isItalic ? styles.active : ''}><em>I</em></button>
          <button onClick={() => setIsUnderline(!isUnderline)} className={isUnderline ? styles.active : ''}><u>U</u></button>
          <button onClick={() => setIsStrikethrough(!isStrikethrough)} className={isStrikethrough ? styles.active : ''}><s>S</s></button>
        </div>
        <textarea
          ref={textareaRef}
          className={`${styles.textarea} ${isBold ? styles.bold : ''} ${isItalic ? styles.italic : ''} ${isUnderline ? styles.underline : ''} ${isStrikethrough ? styles.strikethrough : ''}`}
          placeholder={`Write something for note ${index + 1}...`}
          value={text}
          onChange={handleTextChange}
        />
      </motion.div>
    </Rnd>
  );
};

export default TextNote;
