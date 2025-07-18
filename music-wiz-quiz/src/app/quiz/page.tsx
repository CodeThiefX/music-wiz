"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import questionsData from "@/lib/questions.json";

type Question = {
  question: string;
  options: string[];
  answer: string;
  instrument: string;
};

export default function QuizPage() {
  const router = useRouter();
  const { selectedInstruments, questions, setQuestions, setAnswers, answers } =
    useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizActive, setQuizActive] = useState(true);

  useEffect(() => {
    if (selectedInstruments.length > 0) {
      const combinedQuestions = selectedInstruments.flatMap((instrument) => {
        const instrumentQuestions =
          (questionsData as Record<string, Omit<Question, "instrument">[]>)[
            instrument
          ] || [];
        return instrumentQuestions.map((q) => ({ ...q, instrument }));
      });
      setQuestions(combinedQuestions);
    }
  }, [selectedInstruments, setQuestions]);

  useEffect(() => {
    if (!quizActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizActive, endQuiz]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const endQuiz = useCallback(() => {
    setQuizActive(false);
    router.push("/results");
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[600px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="text-lg font-semibold">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg">{currentQuestion.question}</p>
          <RadioGroup
            value={answers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
            disabled={!quizActive}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || !quizActive}
          >
            Previous
          </Button>
          <div className="flex gap-4">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext} disabled={!quizActive}>
                Next
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={endQuiz}
                disabled={!quizActive}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
