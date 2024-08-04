import { Card, CardContent } from "@/components/ui/card";

export default function Header({ userName }) {
  return (
    <Card className="rounded-none shadow-none border-none">
      <CardContent className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Article to Podcast</h1>
          {userName && (
            <p className="font-mono text-white">{`Hola, ${
              userName.split(" ")[0]
            }`}</p>
          )}
          {/* You can add additional header elements here, like navigation or user info */}
        </div>
      </CardContent>
    </Card>
  );
}
