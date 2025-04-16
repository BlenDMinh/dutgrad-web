'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/api/user.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { useAuth } from '@/context/auth.context';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', username: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
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
      toast.success("Update profile successfully.");
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-1 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8">Unable to load user data.</div>;
  }

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-2">
                    {formData.username.charAt(0).toUpperCase()}
                  </div>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Username"
                  />
                  <Input
                    className="pt-2"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-2">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-semibold">{user.username}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button className="w-full" onClick={handleEditClick}>
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </dt>
                  <dd className="mt-1">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Created At
                  </dt>
                  <dd className="mt-1">
                    {new Date(user.created_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
