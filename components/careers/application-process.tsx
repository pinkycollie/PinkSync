"use client"

import { motion } from "framer-motion"
import { FileText, MessageSquare, Video, Users, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "1. Application",
    description:
      "Submit your resume and a brief introduction. We offer options to apply in written form or via sign language video.",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "2. Initial Conversation",
    description:
      "Chat with our recruiting team about your experience and interests. We provide interpreters for all interviews.",
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: "3. Technical Interview",
    description:
      "Demonstrate your skills in a format that works for you. We focus on practical skills, not whiteboarding.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "4. Team Interview",
    description: "Meet the team you'll be working with and learn more about our culture and values.",
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "5. Offer & Onboarding",
    description:
      "If there's a match, we'll extend an offer and work with you to ensure a smooth onboarding experience.",
  },
]

export function ApplicationProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Application Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've designed an accessible hiring process that focuses on your skills and potential, not your ability to
            hear.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex gap-6 mb-12 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  {step.icon}
                </div>
                {index < steps.length - 1 && <div className="w-0.5 h-12 bg-primary-100 mx-auto mt-2"></div>}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            We provide accommodations throughout the hiring process, including sign language interpreters, captioning,
            and flexible interview formats. Just let us know what you need!
          </p>
        </div>
      </div>
    </section>
  )
}
