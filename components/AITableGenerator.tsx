"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wand2, Sparkles } from "lucide-react";

export default function AITableGenerator() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) {
      setError("Please provide both a prompt and an API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // AI table generation logic will go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    } catch (err) {
      setError("Failed to generate table. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="border border-red-100 dark:border-red-900/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Describe Your Table</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the table structure you want to create..."
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Table
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}