import { motion } from "framer-motion"

interface Step {
  title: string
  content: string
}

interface StepGuideProps {
  steps: Step[]
  activeStep: number
  setActiveStep: (step: number) => void
}

export default function StepGuide({ steps, activeStep, setActiveStep }: StepGuideProps) {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`bg-zinc-800 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
            activeStep === index ? "ring-2 ring-rose-500" : ""
          }`}
          onClick={() => setActiveStep(index)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">{step.title}</h3>
            <span className="text-rose-500 text-xl font-bold">{index + 1}</span>
          </div>
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: activeStep === index ? 1 : 0, height: activeStep === index ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="text-zinc-400"
          >
            {step.content}
          </motion.p>
        </motion.div>
      ))}
    </div>
  )
}