import { useEffect, useState } from 'react';
import { DailyCanvas } from './components/elements/DailyCanvas/DailyCanvas';
import JournalTimeline from './components/elements/JournalTimeline/JournalTimeline';
import { Header } from './components/Header/Header';

function App() {
  const today = new Date().toISOString().split('T')[0];

  const [entryMetaList, setEntryMetaList] = useState([
    { date: today, title: 'Today’s Thoughts', mood: '🧠' }
  ]);

  const [selectedDate, setSelectedDate] = useState(today);

  // Filter only visible entries (up to today)
  const visibleEntries = entryMetaList.filter((entry) => entry.date <= today);

  // Determine if we can add a new blank (only if last is before today)
  const lastEntryDate = entryMetaList[entryMetaList.length - 1].date;
  const canAddNew = lastEntryDate < today;

  // ⏱️ Countdown state (HH:MM:SS string)
  const [countdown, setCountdown] = useState('');

  // 📅 Calculates time left until next midnight
  useEffect(() => {
    if (canAddNew) return; // No countdown if already allowed

    const interval = setInterval(() => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setDate(now.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);

      const diff = nextMidnight.getTime() - now.getTime(); // ms remaining

      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [canAddNew]);

  // ➕ Add a new unlocked day
  const addNewDay = () => {
    if (!canAddNew) return;

    const last = new Date(lastEntryDate);
    last.setDate(last.getDate() + 1);
    const nextDate = last.toISOString().split('T')[0];

    setEntryMetaList([
      ...entryMetaList,
      { date: nextDate, title: '', mood: '' }
    ]);
    setSelectedDate(nextDate);
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-200">
      {/* 🔝 App header */}
      <Header />

      {/* 🗂 Timeline of past entries */}
      <JournalTimeline
        entries={visibleEntries}
        onSelect={(date) => setSelectedDate(date)}
      />

      {/* 📄 The current canvas */}
      <DailyCanvas date={selectedDate} />

      {/* 🔘 New day button & countdown */}
      <div className="sticky bottom-0 z-10 flex flex-col items-center gap-1 py-4 bg-white shadow-inner">
        <button
          className={`px-6 py-3 rounded-full shadow-lg transition-all
            ${canAddNew
              ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
          `}
          onClick={addNewDay}
          disabled={!canAddNew}
          title={canAddNew ? 'Add your next blank day' : 'Next blank unlocks at midnight'}
        >
          + Add New Blank
        </button>

        {/* ⏱️ Countdown below the button */}
        {!canAddNew && (
          <p className="text-xs text-gray-500">Unlocks in {countdown}</p>
        )}
      </div>
    </div>
  );
}

export default App;
