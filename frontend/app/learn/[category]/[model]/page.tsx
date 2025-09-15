"use client"

import { useParams } from "next/navigation"
import { categories } from "../../categories" 
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AlgorithmPage() {
  const params = useParams()
  const category = Array.isArray(params.category) ? params.category[0] : params.category
  const algorithmCategory = category ? categories[category as keyof typeof categories] : undefined
  const model = algorithmCategory?.models.find(item => item.name.toLowerCase().replace(/\s+/g, "-") === (Array.isArray(params.model) ? params.model[0] : params.model))

  if (!model) return <p className="text-center mt-20">Algorithm not found.</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 text-center">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-purple/20 rounded-full blur-3xl" />
      </div>

      <h1 className="text-4xl font-bold mb-4">{model.name}</h1>
      <p className="text-lg text-light-gray/80 max-w-2xl">{model.description}</p>

      {/* Text + GIF container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 p-6 lg:p-10 max-w-6xl">
        <p className="text-md text-justify leading-relaxed flex-1">
          {model.description}
        </p>

        {/* Model GIF */}
        {model.imgPath && (
          <img
            src={model.imgPath}
            alt={`${model.name} visualization`}
            className="flex-1 w-full max-w-lg rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* TRY Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6"
      >
        {/* <Link href={`/learn/${category}/${model}`}>
          <Button
            variant="primary"
            style={{ padding: "10px 22px", borderRadius: "9999px", cursor: "pointer" }}
          >
            Try
          </Button>
        </Link> */}
      </motion.div>
    </div>
  )
}