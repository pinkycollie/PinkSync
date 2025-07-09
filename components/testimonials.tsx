"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "PinkSync has transformed how we deliver accessibility. One integration and our entire digital ecosystem became accessible to deaf users overnight.",
    author: "Sarah Johnson",
    title: "CTO, Global Financial Services Inc.",
    avatar: "/professional-woman-short-hair.png",
  },
  {
    quote:
      "The ROI was immediate. We reduced our accessibility development costs by 70% while expanding our reach to deaf customers globally.",
    author: "Michael Chen",
    title: "Digital Accessibility Director, Retail Giant Co.",
    avatar: "/asian-professional-glasses.png",
  },
  {
    quote:
      "Our legal team loves PinkSync. We've eliminated accessibility compliance risk across all our digital properties with minimal effort.",
    author: "Jessica Rodriguez",
    title: "General Counsel, Healthcare Systems",
    avatar: "/latina-professional-woman.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Enterprise Leaders</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how PinkSync is transforming accessibility for leading organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
