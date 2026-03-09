'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Upload, Play } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState<
    'marriage' | 'serious' | 'dating'
  >('serious');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name);
    setAge(currentUser.age.toString());
    setBio(currentUser.bio);
    setRelationshipGoal(currentUser.relationshipGoal);
    setLocation(currentUser.location);
    setInterests(currentUser.interests.join(', '));
    setPhotos(currentUser.photos);
    setVideos(currentUser.videos);
  }, [currentUser]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotos((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setVideos((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!currentUser) return;

    setIsSaving(true);
    const interestsList = interests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i);

    const updatedUser = {
      ...currentUser,
      name,
      age: parseInt(age),
      bio,
      relationshipGoal,
      location,
      interests: interestsList,
      photos,
      videos,
    };

    updateProfile(updatedUser);
    setIsSaving(false);

    // Show success message
    const originalText = 'Save Profile';
    const btn = document.querySelector(
      'button:has-text("Save Profile")'
    ) as HTMLElement;
    if (btn) {
      btn.textContent = 'Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Looking For
              </label>
              <Select value={relationshipGoal} onValueChange={(value: any) => setRelationshipGoal(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage">Marriage</SelectItem>
                  <SelectItem value="serious">Serious Relationship</SelectItem>
                  <SelectItem value="dating">Dating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Interests (comma separated)
              </label>
              <Input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Travel, Reading, Cooking"
              />
            </div>
          </Card>

          {/* Photos */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Photos
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-border rounded-lg h-32 flex items-center justify-center cursor-pointer hover:bg-muted transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload size={24} />
                  <span className="text-sm">Add Photo</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Add up to 6 high-quality photos to attract more matches
            </p>
          </Card>

          {/* Videos */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Videos
            </h2>
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <div key={idx} className="relative group flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Play size={20} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      Video {idx + 1}
                    </p>
                  </div>
                  <button
                    onClick={() => removeVideo(idx)}
                    className="flex-shrink-0 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-muted transition">
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload size={24} />
                  <span className="text-sm">Add Video</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Add short videos to help others get to know you better
            </p>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
