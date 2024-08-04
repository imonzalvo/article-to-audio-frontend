import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AudioList({ audioFiles, onSelect }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Audio Files</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {audioFiles &&
            audioFiles.map((audio) => (
              <li key={audio.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelect(audio)}
                >
                  <p className="justify-start truncate text-base">
                    {audio.title}
                  </p>
                </Button>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
