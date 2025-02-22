"use client"

import { useFormContext, FieldError } from "react-hook-form"
import { motion } from "framer-motion"
import FormField from "./FormField"

export default function VerificationStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <FormField
        label="Business Verification Document"
        name="verificationDocument"
        type="file"
        register={register}
        error={errors.verificationDocument as FieldError | undefined}
        accept=".pdf,.jpg,.png"
      />
      <div className="mt-4">
        <label className="inline-flex items-center">
          <input type="checkbox" {...register("termsAccepted")} className="form-checkbox h-5 w-5 text-rose-600" />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            I accept the{" "}
            <a href="#" className="text-rose-600 hover:underline">
              Terms and Conditions
            </a>
          </span>
        </label>
        {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message?.toString()}</p>}
      </div>
    </motion.div>
  )
}