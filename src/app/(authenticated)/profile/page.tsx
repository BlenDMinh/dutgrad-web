"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services/api/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/auth.context";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Mail, Calendar, Edit, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", username: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (!user) return;
    setFormData({
      id: String(user.id),
      username: user.username,
      email: user.email,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updated = await userService.updateProfile({
        ...formData,
        id: Number(formData.id),
      });
      setUser(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-1 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center"
      >
        Unable to load user data.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex-1 p-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-5xl font-extrabold mb-10"
        variants={itemVariants}
      >
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Your Profile
        </span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div
          className="col-span-1"
          variants={cardVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-4"
                        animate={{
                          scale: [1, 1.05, 1],
                          borderColor: [
                            "rgba(147, 51, 234, 0.3)",
                            "rgba(236, 72, 153, 0.6)",
                            "rgba(147, 51, 234, 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{ borderWidth: "2px", borderStyle: "solid" }}
                      >
                        {formData.username.charAt(0).toUpperCase()}
                      </motion.div>
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="Username"
                        className="mb-2"
                      />
                      <Input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Email"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          onClick={handleSave}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="viewing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl font-bold text-white mb-2"
                        animate={{
                          scale: [1, 1.03, 1],
                          boxShadow: [
                            "0 4px 6px rgba(0,0,0,0.1)",
                            "0 10px 15px rgba(147,51,234,0.2)",
                            "0 4px 6px rgba(0,0,0,0.1)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </motion.div>
                      <h2 className="text-lg font-semibold">{user.username}</h2>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        onClick={handleEditClick}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 md:col-span-2"
          variants={cardVariants}
        >
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <motion.div variants={itemVariants}>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Full Name
                  </dt>
                  <dd className="mt-1 font-medium">{user.username}</dd>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </dt>
                  <dd className="mt-1 font-medium">{user.email}</dd>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </dt>
                  <dd className="mt-1 font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </motion.div>
                <motion.div
                  className="pt-4 mt-4 border-t"
                  variants={itemVariants}
                >
                  <motion.h3
                    className="font-semibold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Account Statistics
                  </motion.h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Spaces
                      </p>
                      <motion.p
                        className="text-2xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        5
                      </motion.p>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <p className="text-sm font-medium text-muted-foreground">
                        Documents
                      </p>
                      <motion.p
                        className="text-2xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        12
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
