import { useState } from 'react';

interface Props {
  index: number;
}

export function ImageEmbed({ index }: Props) {
  const [url, setUrl] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Paste image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      {url && <img src={url} alt={`Image ${index + 1}`} className="max-w-full rounded" />}
    </div>
  );
}