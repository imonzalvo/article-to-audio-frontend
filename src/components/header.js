import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header({ userName, onLogout, isLoggedIn }) {
  return (
    <Card className="rounded-none shadow-none border-none">
      <CardContent className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Article to Podcast</h1>
          <div className="flex items-center space-x-4">
            {userName && (
              <p className="font-mono text-white">{`Hola, ${
                userName.split(" ")[0]
              }`}</p>
            )}
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-white border-white hover:bg-blue-700 bg-blue-700 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

{/* <AudioPlayer
audio={{
  title: "Artificial Intelligence: Promise and Peril",
  url: "https://article-to-audio.s3.amazonaws.com/test/1cf98a68-3cc4-4e13-925c-2e17a351fd58.mp3",
}}
/> */}