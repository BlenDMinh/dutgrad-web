"use client";
import React, { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { useRouter } from "next/navigation";
import SpaceCard from "../components/SpaceCard";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface YourSpace {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  created_at: string;
}

export default function YourSpacesPage() {
  const [yourSpaces, setYourSpaces] = useState<YourSpace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchYourSpaces = async () => {
      try {
        const response = await spaceService.getYourSpaces();
        setYourSpaces(response.spaces || []);
      } catch (err) {
        setError("Failed to fetch your spaces");
      } finally {
        setLoading(false);
      }
    };

    fetchYourSpaces();
  }, []);

  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: shouldReduceMotion ? 50 : 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.7,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={
                shouldReduceMotion
                  ? { rotate: 0 }
                  : {
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }}
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
              Loading your spaces...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <motion.h1
        className="text-5xl font-extrabold text-center mb-10"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Your Spaces
        </span>
      </motion.h1>

      <motion.p
        className="text-center text-primary text-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: shouldReduceMotion ? 0.3 : 0.7 }}
      >
        <span className="inline-flex items-center gap-2">
          View the spaces you have created or joined
          <motion.span
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: 1,
              repeat: shouldReduceMotion ? 0 : 2,
              repeatDelay: 4,
            }}
          >
            🏠
          </motion.span>
        </span>
      </motion.p>

      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md max-w-md mx-auto"
        >
          <p className="text-center text-red-600">{error}</p>
          <div className="flex justify-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      ) : yourSpaces.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [20, 0] }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-xl p-8 backdrop-blur-sm"
        >
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-6">
            {"🚫 You haven't joined or created any spaces yet."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2 rounded-md shadow-md transition-all"
            onClick={() => router.push("/spaces/create")}
          >
            Create Your First Space
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {yourSpaces.map((space: YourSpace) => (
              <motion.div
                key={space.id}
                variants={itemVariants}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { y: -5, transition: { duration: 0.2 } }
                }
                layout
              >
                <SpaceCard key={space.id} space={space} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
