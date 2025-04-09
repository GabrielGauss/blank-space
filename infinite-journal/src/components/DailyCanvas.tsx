import { useState } from 'react';
import { TextNote } from './elements/TextNote';
import { ImageEmbed } from './elements/ImageEmbed';
import { YoutubeEmbed } from './elements/YoutubeEmbed';

interface Props {
  date: string;
}

export function DailyCanvas({ date }: Props) {
  const [elements, setElements] = useState<any[]>([]);

  const addElement = (type: string) => {
    setElements([...elements, { type }]);
  };

  return (
    <div className="w-full max-w-4xl p-6 my-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold mb-4">{date}</h2>

      <div className="space-y-4">
        {elements.map((el, i) => {
          if (el.type === 'text') return <TextNote key={i} index={i} />;
          if (el.type === 'image') return <ImageEmbed key={i} index={i} />;
          if (el.type === 'youtube') return <YoutubeEmbed key={i} index={i} />;
          return null;
        })}
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={() => addElement('text')}
        >+ Add Note</button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          onClick={() => addElement('image')}
        >+ Add Image</button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          onClick={() => addElement('youtube')}
        >+ Add YouTube</button>
      </div>
    </div>
  );
}