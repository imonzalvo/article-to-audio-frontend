import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LinkInput({ onSubmit, disabled }) {
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(link);
    setLink("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter article URL"
        required
      />
      <Button type="submit" disabled={disabled}>
        Convert
      </Button>
    </form>
  );
}