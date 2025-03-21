"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wand2, Sparkles, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DynamicForm from "@/components/DynamicForm";

export default function AIFormGenerator() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formDefinition, setFormDefinition] = useState(null);
  const [error, setError] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [isCopied, setIsCopied] = useState({ url: false, code: false });

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) {
      setError("Please provide both a prompt and an API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Simulate AI form generation
      const generatedForm = {
        title: "AI Generated Form",
        layout: "grid-cols-2 gap-4",
        fields: [
          {
            name: "name",
            type: "text",
            label: "Full Name",
            required: true,
            position: "col-span-1"
          },
          // Add more fields based on AI response
        ]
      };

      setFormDefinition(generatedForm);
      setFormUrl("https://example.com/form/123"); // Replace with actual URL
    } catch (err) {
      setError("Failed to generate form. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (type) => {
    const textToCopy = type === 'url' ? formUrl : `<iframe src="${formUrl}" />`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setIsCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="space-y-6">
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
                <Label htmlFor="prompt">Describe Your Form</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the form you want to create..."
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
                    Generate Form
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {formDefinition && (
          <Card className="border-green-200 dark:border-green-900/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Form URL</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy('url')}
                    >
                      {isCopied.url ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Input value={formUrl} readOnly className="font-mono" />

                <div className="space-y-2">
                  <Label>Embed Code</Label>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted font-mono text-sm">
                      {`<iframe src="${formUrl}" style="width: 100%; height: 500px; border: none;" />`}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy('code')}
                    >
                      {isCopied.code ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="border border-red-100 dark:border-red-900/20">
          <CardContent className="pt-6">
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <ScrollArea className="h-[600px]">
                  {formDefinition ? (
                    <DynamicForm formDefinition={formDefinition} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Form preview will appear here
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="json">
                <ScrollArea className="h-[600px]">
                  <pre className="p-4 rounded-lg bg-muted font-mono text-sm">
                    {formDefinition ? JSON.stringify(formDefinition, null, 2) : "No form generated yet"}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}