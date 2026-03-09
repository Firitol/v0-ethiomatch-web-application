'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-context';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, User } from 'lucide-react';

export default function AppHome() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Ethiomatch</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/app/discover')}
              className="flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Discover
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/app/messages')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Messages
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/app/profile')}
              className="flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Profile
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <Card className="md:col-span-2 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">Welcome, {currentUser.name}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome to Ethiomatch, where serious relationships begin. Start discovering compatible matches who share your relationship goals.
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Get Started:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">1.</span>
                    <span><strong>Discover:</strong> Swipe through profiles matching your relationship goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">2.</span>
                    <span><strong>Match:</strong> Like profiles and match with people interested in you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">3.</span>
                    <span><strong>Message:</strong> Connect and get to know your matches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">4.</span>
                    <span><strong>Share Media:</strong> Upload photos and videos to your profile</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => router.push('/app/discover')}
                className="bg-red-500 hover:bg-red-600 text-white mt-6 text-lg py-6 px-8"
              >
                Start Discovering Matches
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Looking for</p>
                  <p className="text-lg font-semibold text-red-600 capitalize">
                    {currentUser.relationshipGoal === 'marriage' && '💍 Marriage'}
                    {currentUser.relationshipGoal === 'serious' && '❤️ Serious Relationship'}
                    {currentUser.relationshipGoal === 'dating' && '💕 Dating'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-lg font-semibold">{currentUser.location}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Photos</p>
                  <p className="text-lg font-semibold">{currentUser.photos.length}</p>
                </div>
                <Button
                  onClick={() => router.push('/app/profile')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
