"use client";
import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader, Sparkles, Rocket, Check } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      delay: 0.4,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function InvitationPage() {
  const [loading, setLoading] = useState(true);
  const [canJoin, setCanJoin] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleJoin = async () => {
    if (!token) {
      toast.error("Token not found in URL.");
      return;
    }

    setLoading(true);
    try {
      await spaceService.joinSpaceWithToken(token);
      setSuccess(true);
      setTimeout(() => {
        router.push(APP_ROUTES.SPACES.MINE);
      }, 1500);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message;
      if (errMsg) {
        toast.error(errMsg);
      } else {
        toast.error("Failed to join space");
      }
      setCanJoin(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      return;
    }

    handleJoin();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-green-200 dark:border-green-900"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text"
            >
              Successfully joined!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 text-gray-600 dark:text-gray-300"
            >
              You will be redirected to your spaces...
            </motion.p>
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key="invitation"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-indigo-100 dark:border-indigo-900"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative mx-auto"
            >
              <motion.div
                animate={pulseAnimation}
                className="absolute inset-0 bg-indigo-300/50 dark:bg-indigo-600/30 rounded-full blur-xl"
              />
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="relative bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
              >
                <Rocket className="h-8 w-8 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text"
            >
              {"You've been invited to join a space"}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-6 text-gray-600 dark:text-gray-300"
            >
              Click the button below to accept the invitation.
            </motion.p>

            {canJoin && (
              <motion.div variants={itemVariants}>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleJoin}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all w-full flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="animate-spin mr-2 w-5 h-5" />
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Join Space
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {!canJoin && loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
                    scale: { repeat: Infinity, duration: 1, ease: "easeInOut" },
                  }}
                >
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent" />
                </motion.div>
                <motion.p
                  className="text-gray-500 text-sm mt-4"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Processing invitation...
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background animated elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-br from-purple-300/10 to-indigo-300/10 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%",
              ],
              y: [
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%",
              ],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
