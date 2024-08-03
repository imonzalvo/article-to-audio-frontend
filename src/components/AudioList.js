export default function AudioList({ audioFiles, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Audio Files</h2>
      <ul className="space-y-2">
        {console.log("audio",  audioFiles)}
        {audioFiles && audioFiles.map((audio) => (
          <li key={audio.id} className="bg-white p-3 rounded shadow">
            <button
              onClick={() => onSelect(audio)}
              className="w-full text-left hover:text-blue-600"
            >
              {audio.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
