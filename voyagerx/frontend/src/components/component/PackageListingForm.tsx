// components/PackageListingForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { usePackages } from "@/context/PackageContext";

export default function PackageListingForm() {
  const router = useRouter();
  const { addPackage } = usePackages();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    packageTitle: "",
    destination: "",
    duration: "",
    highlights: "",
    inclusions: "",
    basePrice: 0,
    availability: "",
    images: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "basePrice" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileUrls: string[] = [];

      // Convert files to data URLs
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            fileUrls.push(reader.result.toString());
            if (fileUrls.length === e.target.files!.length) {
              setFormData((prev) => ({ ...prev, images: fileUrls }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the package to context
    addPackage(formData);
    console.log("Package listed successfully", formData);
    setIsSubmitted(true);
  };

  const handleViewPackages = () => {
    router.push("/agencies");
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your package has been listed successfully!
          </AlertDescription>
        </Alert>
        <div className="flex space-x-4">
          <Button variant="destructive" onClick={handleViewPackages}>
            View All Packages
          </Button>
        </div>
      </div>
    );
  }
  
  

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">1. Package Details</h3>
          <div>
            <Label htmlFor="packageTitle">Package Title</Label>
            <Input
              id="packageTitle"
              value={formData.packageTitle}
              onChange={handleChange}
              placeholder="e.g., 7-Day Bali Adventure"
              required
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Bali, Indonesia"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 7 Days / 6 Nights"
              required
            />
          </div>
          <Button type="button" onClick={handleNextStep}>
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">2. Package Details</h3>
          <div>
            <Label htmlFor="highlights">Package Highlights</Label>
            <Textarea
              id="highlights"
              value={formData.highlights}
              onChange={handleChange}
              placeholder="List key attractions and experiences"
              required
            />
          </div>
          <div>
            <Label htmlFor="inclusions">Inclusions & Exclusions</Label>
            <Textarea
              id="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="List what's included and what's not"
              required
            />
          </div>
          <div className="space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">3. Pricing & Availability</h3>
          <div>
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice || ""}
              onChange={handleChange}
              placeholder="Enter base price"
              required
            />
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              type="date"
              value={formData.availability}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="images">Upload Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
            <Button type="submit">Publish Package</Button>
          </div>
        </div>
      )}
    </form>
  );
}