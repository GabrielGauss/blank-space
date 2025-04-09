import styles from './TextNote.module.css';

interface Props {
  index: number;
}

export function TextNote({ index }: Props) {
  return (
    <textarea
      className={styles.textarea}
      placeholder={`Write something for note ${index + 1}...`}
      rows={4}
    />
  );
}