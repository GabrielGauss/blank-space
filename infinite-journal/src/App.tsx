import { useState } from 'react';
import { DailyCanvas } from './components/DailyCanvas';

function App() {
  const [days, setDays] = useState([new Date().toISOString().split('T')[0]]);

  const addNewDay = () => {
    const lastDate = new Date(days[days.length - 1]);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    setDays([...days, nextDate.toISOString().split('T')[0]]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gray-100">
      {days.map((date) => (
        <DailyCanvas key={date} date={date} />
      ))}
      <button
        className="my-8 px-6 py-3 bg-black text-white rounded-full shadow-md hover:bg-gray-800"
        onClick={addNewDay}
      >
        + Add New Blank
      </button>
    </div>
  );
}

export default App;