"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function DynamicForm({ formDefinition }) {
  const [formData, setFormData] = useState({});
  const [tagFields, setTagFields] = useState({});

  if (!formDefinition) {
    return null;
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e, fieldName) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTags = [...(tagFields[fieldName] || []), e.target.value.trim()];
      setTagFields(prev => ({
        ...prev,
        [fieldName]: newTags
      }));
      e.target.value = "";
      e.preventDefault();
    }
  };

  const removeTag = (index, fieldName) => {
    const newTags = tagFields[fieldName].filter((_, i) => i !== index);
    setTagFields(prev => ({
      ...prev,
      [fieldName]: newTags
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, tagFields });
  };

  return (
    <form onSubmit={handleSubmit} className={`grid ${formDefinition.layout} gap-6`}>
      {formDefinition.fields.map((field) => (
        <div key={field.name} className={field.position}>
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {field.type === "text" && (
            <Input
              type="text"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === "textarea" && (
            <Textarea
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === "select" && (
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleInputChange(field.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === "radio" && (
            <RadioGroup
              value={formData[field.name] || ""}
              onValueChange={(value) => handleInputChange(field.name, value)}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                  <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {field.type === "checkbox" && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    checked={formData[field.name]?.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = formData[field.name] || [];
                      handleInputChange(
                        field.name,
                        checked
                          ? [...currentValues, option]
                          : currentValues.filter((v) => v !== option)
                      );
                    }}
                  />
                  <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}

          {field.type === "switch" && (
            <Switch
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
          )}

          {field.type === "slider" && (
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              onValueChange={(value) => handleInputChange(field.name, value[0])}
            />
          )}

          {field.type === "tags" && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Type and press Enter to add tags"
                onKeyDown={(e) => handleTagInput(e, field.name)}
              />
              <div className="flex flex-wrap gap-2">
                {tagFields[field.name]?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index, field.name)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="submit" className="mt-6">Submit</Button>
    </form>
  );
}