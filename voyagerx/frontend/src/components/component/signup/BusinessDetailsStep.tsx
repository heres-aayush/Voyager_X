"use client"

import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import FormField from "./FormField"
import { FieldError } from "react-hook-form"

const businessTypes = [
  "Tour Operator",
  "Adventure Travel",
  "Luxury Travel",
  "Budget Travel",
  "Eco-Tourism",
  "Cultural Tours",
  "Cruise Line",
  "Other",
]

export default function BusinessDetailsStep() {
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
        label="Business Type"
        name="businessType"
        register={register}
        error={errors.businessType as FieldError | undefined}
        type="select"
        options={businessTypes}
      />
      <FormField
        label="Location"
        name="location"
        register={register}
        error={errors.location as FieldError | undefined}
        placeholder="City, Country"
      />
    </motion.div>
  )
}