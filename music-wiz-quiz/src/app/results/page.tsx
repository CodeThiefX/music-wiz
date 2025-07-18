"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const ResultsPage = () => {
  const router = useRouter();
  const { questions, answers, reset } = useStore();

  let score = 0;
  const results = questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.answer;
    if (isCorrect) {
      score++;
    }
    return {
      ...question,
      userAnswer,
      isCorrect,
    };
  });

  const handlePlayAgain = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
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
          <div className="mt-6 text-center">
            <Button onClick={handlePlayAgain}>Play Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
