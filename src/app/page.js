"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LinkInput from "../components/LinkInput";
import AudioList from "../components/AudioList";
import AudioPlayer from "../components/audioPlayer";
import SignInButton from "../components/signInButton";
import Header from "../components/header";
import { signOut } from "next-auth/react";
import Spinner from "../components/Spinner"; // Import the new Spinner component

export default function Home() {
  const { data: session, status } = useSession();
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAudioFiles();
    }
  }, [status]);

  const fetchAudioFiles = async () => {
    try {
      setError(null);
      const response = await fetch("/api/audio-files");
      const data = await response.json();

      if (response.status === 401 && data.signOut) {
        await signOut({ redirect: false });
        localStorage.removeItem("jwtToken");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Fetched audio files:", data);
      if (Array.isArray(data)) {
        setAudioFiles(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching audio files:", error);
      setError("Failed to fetch audio files. Please try again later.");
    }
  };

  const handleLinkSubmit = async (link) => {
    try {
      setError(null);
      const response = await fetch("/api/submit-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        fetchAudioFiles();
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error converting article:", error);
      setError("Failed to convert article. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {status === "loading" ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : status === "authenticated" ? (
          <>
            <LinkInput onSubmit={handleLinkSubmit} />
            {error && <div className="text-red-500 mt-4">{error}</div>}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <AudioPlayer audio={selectedAudio} />
              <AudioList
                audioFiles={audioFiles}
                onSelect={(audio) => setSelectedAudio(audio)}
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Article to Podcast
            </h2>
            <p className="mb-4">
              Please sign in to access the audio conversion feature.
            </p>
            <SignInButton />
          </div>
        )}
      </main>
    </div>
  );
}
