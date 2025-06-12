'use client'

import { motion } from 'framer-motion'

export const AnimatedHero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center py-16"
    >
      <h1 className="text-4xl font-bold mb-4">Atendor – Your smart assistant</h1>
      <p className="text-lg text-muted-foreground">
        Automate customer communication and grow your local business.
      </p>
    </motion.section>
  )
}
