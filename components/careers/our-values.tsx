"use client"

import { motion } from "framer-motion"

const values = [
  {
    title: "Deaf-First Design",
    description:
      "We design for deaf users first, creating experiences that are visually intuitive and accessible by default.",
    color: "bg-purple-100 text-purple-800",
  },
  {
    title: "Visual Communication",
    description:
      "We prioritize visual communication in everything we build, recognizing that many deaf individuals think and communicate visually.",
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Authentic Representation",
    description: "We ensure deaf individuals are represented in our team, leadership, and decision-making processes.",
    color: "bg-green-100 text-green-800",
  },
  {
    title: "Continuous Learning",
    description: "We commit to ongoing education about deaf culture, sign language, and accessibility best practices.",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    title: "Inclusive Innovation",
    description: "We believe that designing for deaf accessibility leads to better products for everyone.",
    color: "bg-red-100 text-red-800",
  },
  {
    title: "Community Empowerment",
    description: "We actively work to build and support the deaf developer community through education and advocacy.",
    color: "bg-indigo-100 text-indigo-800",
  },
]

export function OurValues() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core principles guide our work and shape our culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`p-4 rounded-lg ${value.color}`}>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p>{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
