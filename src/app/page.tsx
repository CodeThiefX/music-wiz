"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { setFullName, setSelectedInstruments, setDifficulty } = useStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
            <div className="flex flex-col space-y-1.5">
              <Label>Select Difficulty</Label>
              <Select onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleStartQuiz}
            className="w-1/2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Start Quiz"
            )}
          </Button>
          <Button
            onClick={() => router.push("/leaderboard")}
            className="w-1/2"
            variant="outline"
          >
            View Leaderboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
