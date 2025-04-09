interface Props {
    index: number;
  }
  
  export function TextNote({ index }: Props) {
    return (
      <textarea
        className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={`Write something for note ${index + 1}...`}
        rows={4}
      />
    );
  }