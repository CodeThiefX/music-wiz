"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "../lib/store";
import questions from "../lib/questions.json";

type Instrument =
  | "Clarinet"
  | "Saxophone"
  | "Trumpet"
  | "Violin"
  | "Trombone"
  | "Euphonium";

const instruments = Object.keys(questions) as Instrument[];

export default function Home() {
  const router = useRouter();
  const { setFullName, setSelectedInstruments } = useStore();
  const [name, setName] = useState("");
  const [selectedInstrumentsState, setSelectedInstrumentsState] = useState<
    Instrument[]
  >([]);

  const handleInstrumentChange = (instrument: Instrument) => {
    setSelectedInstrumentsState((prev) =>
      prev.includes(instrument)
        ? prev.filter((i) => i !== instrument)
        : [...prev, instrument]
    );
  };

  const handleStartQuiz = () => {
    setFullName(name);
    setSelectedInstruments(selectedInstrumentsState);
    router.push("/quiz");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Music Wiz!</CardTitle>
          <CardDescription>
            Please enter your name and select the instruments for your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Select Instruments</Label>
              <div className="grid grid-cols-2 gap-4">
                {instruments.map((instrument) => (
                  <div key={instrument} className="flex items-center space-x-2">
                    <Checkbox
                      id={instrument}
                      checked={selectedInstrumentsState.includes(instrument)}
                      onCheckedChange={() => handleInstrumentChange(instrument)}
                    />
                    <Label htmlFor={instrument}>{instrument}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
