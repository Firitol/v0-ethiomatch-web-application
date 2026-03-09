'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/lib/db';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      router.push('/app/discover');
    }
    setUsers(Database.getUsers());
  }, [currentUser, router]);

  const handleLogin = (userId: string) => {
    login(userId);
    router.push('/app/discover');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Ethiomatch</h1>
          </div>
          <p className="text-xl text-gray-800">Find Meaningful Connections</p>
          <p className="text-sm text-gray-600 mt-2">Select a profile to get started</p>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {users.map((user) => (
            <Card
              key={user.id}
              className="bg-white hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-red-200"
              onClick={() => handleLogin(user.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900">
                      {user.name}, {user.age}
                    </CardTitle>
                    <CardDescription className="text-base mt-1 text-red-600">
                      {user.relationshipGoal === 'marriage' && 'Looking for Marriage'}
                      {user.relationshipGoal === 'serious' && 'Serious Relationship'}
                      {user.relationshipGoal === 'dating' && 'Dating'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{user.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.slice(0, 3).map((interest: string) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="pt-4">
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogin(user.id);
                    }}
                  >
                    Login as {user.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo version - Select any profile to explore Ethiomatch</p>
        </div>
      </div>
    </div>
  );
}
