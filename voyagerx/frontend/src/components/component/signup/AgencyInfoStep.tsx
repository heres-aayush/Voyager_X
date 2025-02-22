"use client"

import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import FormField from "./FormField"
import { FieldError } from "react-hook-form"

export default function AgencyInfoStep() {
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
        label="Agency Name"
        name="agencyName"
        register={register}
        error={errors.agencyName as FieldError | undefined}
        placeholder="Enter your agency name"
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email as FieldError | undefined}
        placeholder="your@email.com"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password as FieldError | undefined}
        placeholder="Create a strong password"
      />
    </motion.div>
  )
}