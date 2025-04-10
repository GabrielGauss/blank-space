import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import styles from './EditDropdown.module.css';

interface Props {
  onColorChange: (color: 'yellow' | 'blue' | 'green' | 'pink') => void;
  onDelete: () => void;
}

export default function EditDropdown({ onColorChange, onDelete }: Props) {
  return (
    <motion.div
      className={styles.dropdown}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
    >
      <div className={styles.colorList}>
        <button onClick={() => onColorChange('yellow')} className={styles.bgYellow} />
        <button onClick={() => onColorChange('blue')} className={styles.bgBlue} />
        <button onClick={() => onColorChange('green')} className={styles.bgGreen} />
        <button onClick={() => onColorChange('pink')} className={styles.bgPink} />
      </div>
      <button className={styles.deleteBtn} onClick={onDelete} title="Delete">
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
