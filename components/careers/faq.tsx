"use client"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need to know sign language to work at MBTQ?",
    answer:
      "While knowing sign language is beneficial, it's not required for all positions. We provide sign language classes for all employees and have interpreters available for meetings. What's most important is your openness to learning about deaf culture and commitment to accessibility.",
  },
  {
    question: "What accommodations do you provide for deaf employees?",
    answer:
      "We provide a range of accommodations including sign language interpreters, captioning services, visual alerting systems, and deaf-friendly communication tools. Our workplace is designed with visual communication in mind, and we're always open to additional accommodations based on individual needs.",
  },
  {
    question: "Is MBTQ a fully remote company?",
    answer:
      "Yes, we're a fully remote company with team members across the United States. We believe in creating an accessible workplace that allows everyone to work in their most comfortable environment. We do occasionally have optional in-person team gatherings with full accessibility support.",
  },
  {
    question: "What's your approach to work-life balance?",
    answer:
      "We believe in sustainable work practices and respect for personal time. We offer flexible working hours, generous PTO, and encourage regular breaks. Our goal is to create an environment where everyone can do their best work without burnout.",
  },
  {
    question: "How do you handle communication in a team with both deaf and hearing members?",
    answer:
      "We use a combination of tools and practices to ensure seamless communication. This includes video meetings with interpreters and captioning, asynchronous communication through text-based channels, and visual collaboration tools. We also provide communication guidelines to ensure everyone can participate fully.",
  },
  {
    question: "What benefits do you offer?",
    answer:
      "We offer competitive compensation, comprehensive health insurance (including mental health coverage), 401(k) matching, professional development stipends, home office setup allowance, and deaf-specific benefits like sign language interpreter credits and captioning services for personal use.",
  },
]

export function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Common questions about working at MBTQ.dev</p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have more questions? Feel free to reach out to us at{" "}
            <a href="mailto:careers@mbtq.dev" className="text-purple-600 hover:underline">
              careers@mbtq.dev
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
