import { useState } from "react";

export default function LinkInput({ onSubmit }) {
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(link);
    setLink("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter article URL"
        className="flex-grow p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Convert
      </button>
    </form>
  );
}
