"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/forms";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface FormFieldEditorProps {
  field: FormField;
  index: number;
  updateField: (index: number, field: FormField) => void;
  removeField: (index: number) => void;
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "switch", label: "Toggle Switch" },
  { value: "slider", label: "Slider" },
  { value: "tags", label: "Tags Input" },
  { value: "file", label: "File Upload" },
];

const FIELD_POSITIONS = [
  { value: "col-span-1", label: "Normal width" },
  { value: "col-span-2", label: "Double width" },
  { value: "col-span-3", label: "Triple width" },
  { value: "col-span-full", label: "Full width" },
];

export default function FormFieldEditor({ field, index, updateField, removeField }: FormFieldEditorProps) {
  const handleChange = (key: keyof FormField, value: any) => {
    updateField(index, { ...field, [key]: value });
  };

  const handleOptionsChange = (optionsText: string) => {
    const options = optionsText
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option !== "");
    updateField(index, { ...field, options });
  };

  const getOptionsString = () => {
    return field.options?.join(", ") || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="px-2 py-0 text-xs">
              Field {index + 1}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeField(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 -mt-2 -mr-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`field-${index}-label`}>Field Label</Label>
              <Input
                id={`field-${index}-label`}
                value={field.label}
                onChange={(e) => handleChange("label", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-${index}-name`}>Field Name (ID)</Label>
              <Input
                id={`field-${index}-name`}
                value={field.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="advanced">
              <AccordionTrigger>Advanced Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}-validation`}>Validation</Label>
                    <Input
                      id={`field-${index}-validation`}
                      value={field.validation || ""}
                      onChange={(e) => handleChange("validation", e.target.value)}
                      placeholder="Enter validation pattern..."
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
