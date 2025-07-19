"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const ResultsPage = () => {
  const router = useRouter();
  const { name, questions, answers, reset, selectedInstruments } = useStore();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const score = questions.reduce((acc, question, index) => {
    return answers[index] === question.answer ? acc + 1 : acc;
  }, 0);

  useEffect(() => {
    const saveScore = async () => {
      try {
        await fetch("/api/scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, score, instruments: selectedInstruments }),
        });
      } catch (error) {
        console.error("Failed to save score", error);
      }
    };

    if (name) {
      saveScore();
    }
  }, [name, score, selectedInstruments]);

  const results = questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.answer;
    return {
      ...question,
      userAnswer,
      isCorrect,
    };
  });

  const handlePlayAgain = () => {
    setLoading(true);
    reset();
    router.push("/");
  };

  const handleDownload = async () => {
    if (resultsRef.current) {
      setDownloading(true);
      try {
        const dataUrl = await toPng(resultsRef.current);
        const link = document.createElement("a");
        link.download = "quiz-results.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("oops, something went wrong!", error);
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl" ref={resultsRef}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-2xl font-bold">Well done, {name}!</p>
            <p className="text-xl">
              You scored {score} out of {questions.length}
            </p>
          </div>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.isCorrect
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                <p className="font-semibold">{result.question}</p>
                <p>Your answer: {result.userAnswer || "Not answered"}</p>
                {!result.isCorrect && <p>Correct answer: {result.answer}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={handlePlayAgain} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Play Again"
              )}
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Download Result"
              )}
            </Button>
            <Button onClick={() => router.push("/leaderboard")}>
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
