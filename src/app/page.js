"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LinkInput from "../components/LinkInput";
import AudioList from "../components/AudioList";
import AudioPlayer from "../components/audioPlayer";
import SignInButton from "../components/signInButton";
import Header from "../components/header";
import { signOut } from "next-auth/react";
import Spinner from "../components/Spinner";

export default function Home() {
  const { data: session, status } = useSession();
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

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
      setIsSubmitting(true);
      setProgress(0);
      setProgressMessage("");

      const response = await fetch("/api/submit-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const updates = chunk.split("\n").filter(Boolean).map(JSON.parse);

        updates.forEach((update) => {
          if (update.progress) setProgress(update.progress);
          if (update.message) setProgressMessage(update.message);
          if (update.error) throw new Error(update.error);
        });
      }

      fetchAudioFiles();
    } catch (error) {
      console.error("Error converting article:", error);
      setError(
        error.message || "Failed to convert article. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName={session?.user?.name} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {status === "loading" ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : status === "authenticated" ? (
          <>
            <LinkInput onSubmit={handleLinkSubmit} disabled={isSubmitting} />
            {isSubmitting && (
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>{progress}%</span>
                </div>
                {progressMessage && <p className="mt-2">{progressMessage}</p>}
              </div>
            )}
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
