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
import { Headphones, BookOpen, Zap, ExternalLink } from "lucide-react";

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

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("jwtToken");
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
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining data in the buffer
          if (buffer) {
            processUpdate(buffer);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const update = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          processUpdate(update);
        }
      }

      await fetchAudioFiles();
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

  const processUpdate = (update) => {
    try {
      const parsedUpdate = JSON.parse(update);
      console.log("Processed update:", parsedUpdate); // For debugging
      if (parsedUpdate.progress) setProgress(parsedUpdate.progress);
      // if (parsedUpdate.message) setProgressMessage(parsedUpdate.message);
      if (parsedUpdate.error) throw new Error(parsedUpdate.error);
    } catch (error) {
      console.error("Error processing update:", error, "Raw update:", update);
    }
  };

  const LoggedOutContent = () => (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Article to Podcast</h1>
      <p className="text-xl mb-8">
        Transform your favorite articles into engaging audio content. Listen on
        the go!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<BookOpen className="w-12 h-12 text-blue-500" />}
          title="Easy Conversion"
          description="Simply paste an article link, and we'll convert it to audio."
        />
        <FeatureCard
          icon={<Headphones className="w-12 h-12 text-blue-500" />}
          title="Listen Anywhere"
          description="Access your audio articles on any device, anytime."
        />
        <FeatureCard
          icon={<Zap className="w-12 h-12 text-blue-500" />}
          title="Save Time"
          description="Consume content faster by listening instead of reading."
        />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
        <SignInButton />
      </div>
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="flex flex-row justify-center align-middle mb-4">
          <h3 className="text-xl font-semibold mr-2">Try a sample audio</h3>
          <a
            href="https://austenangell.substack.com/p/artificial-intelligence-promise-and"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Read article <ExternalLink className="ml-1 w-4 h-4" />
          </a>
        </div>
        <div className="max-w-md mx-auto">
          <AudioPlayer
            audio={{
              title: "Artificial Intelligence: Promise and Peril",
              url: "https://article-to-audio.s3.amazonaws.com/test/1cf98a68-3cc4-4e13-925c-2e17a351fd58.mp3",
            }}
          />
        </div>
      </div>
    </div>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        userName={session?.user?.name}
        onLogout={handleSignOut}
        isLoggedIn={status === "authenticated"}
      />
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
          <LoggedOutContent />
        )}
      </main>
    </div>
  );
}
