"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import questions from "@/lib/questions.json";

type Score = {
  name: string;
  score: number;
  instruments: string[];
  difficulty: string;
};

const instruments = ["All Instruments", ...Object.keys(questions)];

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] =
    useState("All Instruments");

  const filteredScores = useMemo(() => {
    if (selectedInstrument === "All Instruments") {
      return scores;
    }
    return scores.filter((score) =>
      score.instruments.includes(selectedInstrument)
    );
  }, [scores, selectedInstrument]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores");
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center">Leaderboard</h1>
          <Select
            onValueChange={setSelectedInstrument}
            defaultValue={selectedInstrument}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by instrument" />
            </SelectTrigger>
            <SelectContent>
              {instruments.map((instrument) => (
                <SelectItem key={instrument} value={instrument}>
                  {instrument}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <p>Loading scores...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Instruments</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{score.name}</TableCell>
                  <TableCell>{score.instruments.join(", ")}</TableCell>
                  <TableCell>{score.difficulty}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-6 text-center">
          <Link href="/" passHref>
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
