import styles from './JournalTimeline.module.css';

interface EntryMeta {
  date: string;
  title: string;
  mood: string;
}

interface Props {
  entries: EntryMeta[];
  onSelect: (date: string) => void;
}

export default function JournalTimeline({ entries, onSelect }: Props) {
  return (
    <div className={styles.timeline}>
      {entries.map((entry) => (
        <button key={entry.date} className={styles.timelineItem} onClick={() => onSelect(entry.date)}>
          <span className={styles.date}>{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
          <span className={styles.mood}>{entry.mood || '🗓️'}</span>
          <span className={styles.title}>{entry.title || 'Untitled'}</span>
        </button>
      ))}
    </div>
  );
}
