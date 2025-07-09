"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "As a deaf developer, I've never felt more at home than at MBTQ. The team truly understands the visual way I think and communicate, and I'm empowered to build technology that makes a real difference for our community.",
    author: "Sarah Chen",
    title: "Senior Frontend Developer",
    avatar: "/placeholder.svg?height=100&width=100&query=asian woman with short hair smiling",
  },
  {
    quote:
      "Working at MBTQ has transformed my career. I'm not just accommodated here — I'm celebrated for the unique perspective I bring as a deaf engineer. We're building something revolutionary together.",
    author: "Marcus Johnson",
    title: "Accessibility Engineer",
    avatar: "/placeholder.svg?height=100&width=100&query=black man with glasses professional headshot",
  },
  {
    quote:
      "The inclusive culture at MBTQ is unlike anywhere I've worked before. As a hearing person, I've learned so much about deaf culture and visual communication, which has made me a better designer and a better ally.",
    author: "Jessica Rodriguez",
    title: "UX Design Lead",
    avatar: "/placeholder.svg?height=100&width=100&query=latina woman professional headshot",
  },
]

export function TeamTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the people building MBTQ.dev and why they love working here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
