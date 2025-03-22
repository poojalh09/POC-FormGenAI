"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  Save,
  RefreshCw,
  PlusCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DynamicForm from "@/components/DynamicForm";
import { FormField } from "@/types/forms";
import { Skeleton } from "@/components/ui/skeleton";
import FormFieldEditor from "@/components/FormFieldEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const EXAMPLE_PROMPTS = [
  "Create a patient registration form with personal details, medical history, and insurance information",
  "Make a clinical trial enrollment form with consent sections and eligibility questions",
  "Design a medication order form with dosage options and administration instructions",
  "Build a research study participant form with demographic questions and study-specific fields"
];

export default function AIFormGenerator() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formDefinition, setFormDefinition] = useState<{
    title: string;
    layout: string;
    fields: FormField[];
  } | null>(null);
  const [error, setError] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [isCopied, setIsCopied] = useState({ url: false, code: false });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFormDefinition, setEditedFormDefinition] = useState<{
    title: string;
    layout: string;
    fields: FormField[];
  } | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  // Load API key from localStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
      toast.success("API key saved for future sessions");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please provide a description of the form you want to create");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please provide an OpenAI API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a sample form based on the prompt
      const sampleForm = generateSampleForm(prompt);
      setFormDefinition(sampleForm);
      setEditedFormDefinition(JSON.parse(JSON.stringify(sampleForm))); // Deep copy
      
      // Generate a sample form URL
      const randomId = Math.random().toString(36).substring(2, 10);
      setFormUrl(`https://forms.yourcompany.com/${randomId}`);
      
      toast.success("Form generated successfully!");
    } catch (err) {
      setError("Failed to generate form. Please check your API key and try again.");
      toast.error("Form generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSampleForm = (prompt: string) => {
    // This is a mock function that generates a form based on the prompt
    // In a real implementation, this would be replaced by AI-generated content
    const lowercasePrompt = prompt.toLowerCase();
    
    let fields: FormField[] = [];
    
    // Add some basic fields
    fields.push({
      name: "fullName",
      type: "text",
      label: "Full Name",
      required: true,
      position: "col-span-2",
      placeholder: "Enter your full name"
    });
    
    fields.push({
      name: "email",
      type: "text",
      label: "Email Address",
      required: true,
      position: "col-span-1",
      placeholder: "youremail@example.com",
      validation: "email"
    });

    // Add more fields based on the prompt content
    if (lowercasePrompt.includes("patient") || lowercasePrompt.includes("medical") || lowercasePrompt.includes("health")) {
      fields.push({
        name: "dateOfBirth",
        type: "date",
        label: "Date of Birth",
        required: true,
        position: "col-span-1"
      });
      
      fields.push({
        name: "medicalHistory",
        type: "textarea",
        label: "Medical History",
        required: false,
        position: "col-span-2",
        placeholder: "Please provide relevant medical history"
      });
      
      fields.push({
        name: "allergies",
        type: "tags",
        label: "Allergies",
        required: false,
        position: "col-span-2",
        placeholder: "Type and press Enter to add allergies"
      });
    }
    
    if (lowercasePrompt.includes("clinical") || lowercasePrompt.includes("trial") || lowercasePrompt.includes("study")) {
      fields.push({
        name: "studyConsent",
        type: "switch",
        label: "I consent to participate in this study",
        required: true,
        position: "col-span-2"
      });
      
      fields.push({
        name: "participationLevel",
        type: "radio",
        label: "Participation Level",
        required: true,
        position: "col-span-2",
        options: ["Full participation", "Limited participation", "Control group"]
      });
    }
    
    if (lowercasePrompt.includes("medication") || lowercasePrompt.includes("drug") || lowercasePrompt.includes("prescription")) {
      fields.push({
        name: "medicationName",
        type: "text",
        label: "Medication Name",
        required: true,
        position: "col-span-2"
      });
      
      fields.push({
        name: "dosage",
        type: "select",
        label: "Dosage",
        required: true,
        position: "col-span-1",
        options: ["Low", "Medium", "High"]
      });
      
      fields.push({
        name: "frequency",
        type: "select",
        label: "Frequency",
        required: true,
        position: "col-span-1",
        options: ["Once daily", "Twice daily", "Three times daily", "As needed"]
      });
    }

    return {
      title: getFormTitle(prompt),
      layout: "grid-cols-2 gap-4",
      fields: fields
    };
  };

  const getFormTitle = (prompt: string) => {
    // Extract a title from the prompt
    const words = prompt.split(" ");
    let title = "";
    
    if (words.length <= 3) {
      title = `${prompt} Form`;
    } else {
      // Use the first 3-5 words
      const titleWords = words.slice(0, Math.min(5, words.length));
      title = `${titleWords.join(" ")} Form`;
    }
    
    // Capitalize first letter of each word
    return title.split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const handleCopy = (type: 'url' | 'code') => {
    const textToCopy = type === 'url' ? formUrl : `<iframe src="${formUrl}" style="width: 100%; height: 600px; border: none;" />`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setIsCopied(prev => ({ ...prev, [type]: false })), 2000);
    toast.success(`${type === 'url' ? 'URL' : 'Embed code'} copied to clipboard`);
  };

  const saveFormChanges = () => {
    if (editedFormDefinition) {
      setFormDefinition(editedFormDefinition);
      setIsEditMode(false);
      toast.success("Form changes saved successfully");
    }
  };

  const cancelFormChanges = () => {
    if (formDefinition) {
      setEditedFormDefinition(JSON.parse(JSON.stringify(formDefinition)));
      setIsEditMode(false);
    }
  };

  const updateField = (index: number, updatedField: FormField) => {
    if (editedFormDefinition) {
      const newFields = [...editedFormDefinition.fields];
      newFields[index] = updatedField;
      setEditedFormDefinition({
        ...editedFormDefinition,
        fields: newFields
      });
    }
  };

  const addNewField = () => {
    if (editedFormDefinition) {
      const newField: FormField = {
        name: `field_${editedFormDefinition.fields.length + 1}`,
        type: "text",
        label: "New Field",
        required: false,
        position: "col-span-1"
      };
      
      setEditedFormDefinition({
        ...editedFormDefinition,
        fields: [...editedFormDefinition.fields, newField]
      });
    }
  };

  const removeField = (index: number) => {
    if (editedFormDefinition) {
      const newFields = editedFormDefinition.fields.filter((_, i) => i !== index);
      setEditedFormDefinition({
        ...editedFormDefinition,
        fields: newFields
      });
    }
  };

  const updateFormLayout = (layout: string) => {
    if (editedFormDefinition) {
      setEditedFormDefinition({
        ...editedFormDefinition,
        layout
      });
    }
  };

  const updateFormTitle = (title: string) => {
    if (editedFormDefinition) {
      setEditedFormDefinition({
        ...editedFormDefinition,
        title
      });
    }
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4"
    >
      <div className="space-y-6">
        <Card className="border border-red-100 dark:border-red-900/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={saveApiKey}
                    className="text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save Key
                  </Button>
                </div>
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="prompt">Describe Your Form</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-xs"
                  >
                    {showExamples ? "Hide Examples" : "Show Examples"}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showExamples && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {EXAMPLE_PROMPTS.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => useExamplePrompt(example)}
                          className="w-full justify-start text-left text-xs h-auto py-2 overflow-hidden whitespace-normal"
                        >
                          {example}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
                        <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
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
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="space-y-6">
        <Card className="border border-red-100 dark:border-red-900/20">
          <CardContent className="pt-6">
            <Tabs defaultValue="preview">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                
                {isEditMode && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={cancelFormChanges}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={saveFormChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="preview">
                <ScrollArea className="h-[600px] rounded-md border">
                  {isGenerating ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      </div>
                      <Skeleton className="h-10 w-1/4 mt-4" />
                    </div>
                  ) : formDefinition ? (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6">{formDefinition.title}</h2>
                      <DynamicForm formDefinition={formDefinition} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-6">
                      Form preview will appear here
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="edit" onSelect={() => setIsEditMode(true)}>
                {editedFormDefinition ? (
                  <ScrollArea className="h-[600px] rounded-md border">
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="formTitle">Form Title</Label>
                          <Input
                            id="formTitle"
                            value={editedFormDefinition.title}
                            onChange={(e) => updateFormTitle(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="formLayout">Layout</Label>
                          <Select
                            value={editedFormDefinition.layout}
                            onValueChange={updateFormLayout}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid-cols-1 gap-4">Single column</SelectItem>
                              <SelectItem value="grid-cols-2 gap-4">Two columns</SelectItem>
                              <SelectItem value="grid-cols-3 gap-4">Three columns</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Form Fields</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={addNewField}
                            className="flex items-center gap-1"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Field
                          </Button>
                        </div>
                        
                        <div className="space-y-6">
                          {editedFormDefinition.fields.map((field, index) => (
                            <FormFieldEditor
                              key={index}
                              field={field}
                              index={index}
                              updateField={updateField}
                              removeField={removeField}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[600px] text-muted-foreground border rounded-md">
                    Generate a form first to edit it
                  </div>
                )}
              </TabsContent>

              <TabsContent value="json">
                <ScrollArea className="h-[600px] rounded-md border">
                  <pre className="p-4 font-mono text-sm">
                    {formDefinition ? JSON.stringify(formDefinition, null, 2) : "No form generated yet"}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}