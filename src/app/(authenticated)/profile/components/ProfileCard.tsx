"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserCircle, Edit, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { userService } from "@/services/api/user.service";

interface ProfileCardProps {
  user: any;
  setUser: (user: any) => void;
}

export function ProfileCard({ user, setUser }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", username: "", email: "" });

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

  return (
    <Card className="shadow-md h-full">
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
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-4 border-2 border-primary/30">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  placeholder="Username"
                  className="mb-2"
                />
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={handleSave} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
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
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button className="w-full" onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
