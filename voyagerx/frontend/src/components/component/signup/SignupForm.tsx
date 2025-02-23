"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AgencyInfoStep from "./AgencyInfoStep";
import BusinessDetailsStep from "./BusinessDetailsStep";
import VerificationStep from "./VerificationStep";
import SuccessStep from "./SuccessStep";

interface SignupFormProps {
  className?: string;
}

const signupSchema = z.object({
  agencyName: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  location: z.string(),
  verificationDocument: z.any(),
  termsAccepted: z.boolean().refine((val: boolean) => val === true, "You must accept the terms and conditions"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const steps = ["Agency Info", "Business Details", "Verification"];

export default function SignupForm({ className = "" }: SignupFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (plan: string) => {
    console.log(`User selected: ${plan}`);
    setCurrentStep(3); // Move to success step
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})} className={`w-full max-w-md ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Join VoyagerX</h1>
          <div className="mb-6">
            <ol className="flex items-center w-full">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className={`flex w-full items-center ${
                    index < currentStep ? "text-rose-600 dark:text-rose-500" : "text-gray-500 dark:text-gray-400"
                  } after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-4 after:inline-block`}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                    {index < currentStep ? (
                      <svg
                        className="w-3.5 h-3.5 text-rose-600 lg:w-4 lg:h-4 dark:text-rose-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <AnimatePresence mode="wait">
            {currentStep === 0 && <AgencyInfoStep key="step1" />}
            {currentStep === 1 && <BusinessDetailsStep key="step2" />}
            {currentStep === 2 && <VerificationStep key="step3" />}
            {currentStep === 3 && <SuccessStep key="success" />}
          </AnimatePresence>

          {/* New Platform Plan Buttons */}
          {currentStep === 2 && (
            <div className="flex flex-col space-y-4 mt-6">
              <button
                type="button"
                onClick={() => onSubmit("6 Months Plan")}
                className="w-full px-4 py-3 text-lg font-medium text-white bg-rose-600 rounded-md shadow-md hover:bg-rose-700 transition"
              >
                Choose 6 Months Plan
              </button>
              <button
                type="button"
                onClick={() => onSubmit("1 Year Plan")}
                className="w-full px-4 py-3 text-lg font-medium text-white bg-rose-600 rounded-md shadow-md hover:bg-rose-700 transition"
              >
                Choose 1 Year Plan
              </button>
            </div>
          )}

          {currentStep < steps.length && (
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Back
                </button>
              )}
              {currentStep < 2 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </motion.div>
      </form>
    </FormProvider>
  );
}
