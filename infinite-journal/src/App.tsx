import { useState } from 'react';
import { DailyCanvas } from './components/elements/DailyCanvas/DailyCanvas';
import { Header } from './components/Header/Header';

function App() {
  const [days, setDays] = useState([new Date().toISOString().split('T')[0]]);

  const addNewDay = () => {
    const lastDate = new Date(days[days.length - 1]);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    setDays([...days, nextDate.toISOString().split('T')[0]]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-200">
          <Header />

      {days.map((date) => (
        <DailyCanvas key={date} date={date} />
      ))}
      <div className="sticky bottom-0 z-10 flex justify-center py-4 bg-white shadow-inner">
        <button
          className="px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800"
          onClick={addNewDay}
        >
          + Add New Blank
        </button>
      </div>
    </div>
  );
}

export default App;