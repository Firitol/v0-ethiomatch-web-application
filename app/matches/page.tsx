'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import { Database, Conversation, User, Message } from '@/lib/db';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, X } from 'lucide-react';
import Image from 'next/image';

export default function MatchesPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    if (!currentUser) return;

    const allConversations = Database.getConversations();
    const matchedConversations = allConversations.filter(
      (c) => c.participants.includes(currentUser.id)
    );
    setConversations(matchedConversations);

    const allUsers = Database.getUsers();
    setUsers(allUsers);

    if (matchedConversations.length > 0) {
      setSelectedConversation(matchedConversations[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!selectedConversation) return;

    const allMessages = Database.getMessages();
    const conversationMessages = allMessages.filter(
      (m) => m.conversationId === selectedConversation
    );
    setMessages(conversationMessages);
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!selectedConversation || (!messageText.trim() && !selectedMedia)) return;

    const conversation = conversations.find((c) => c.id === selectedConversation);
    if (!conversation) return;

    const recipientId = conversation.participants.find((p) => p !== currentUser!.id);
    if (!recipientId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: currentUser!.id,
      receiverId: recipientId,
      content: messageText,
      mediaUrl: selectedMedia?.url,
      mediaType: selectedMedia?.type,
      createdAt: Date.now(),
      read: false,
    };

    const allMessages = Database.getMessages();
    allMessages.push(newMessage);
    Database.saveMessages(allMessages);

    setMessages([...messages, newMessage]);
    setMessageText('');
    setSelectedMedia(null);
  };

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const type = file.type.startsWith('image') ? 'image' : 'video';
      setSelectedMedia({ url, type });
    };
    reader.readAsDataURL(file);
  };

  const getOtherUserName = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find((p) => p !== currentUser?.id);
    const user = users.find((u) => u.id === otherUserId);
    return user?.name || 'Unknown';
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
    <div className="flex flex-col h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No matches yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start swiping to find your perfect match!
              </p>
              <Button onClick={() => router.push('/')}>
                Discover Profiles
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full">
            {/* Conversations List */}
            <div className="md:col-span-1 border-r border-border overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-border text-left hover:bg-muted transition ${
                    selectedConversation === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <p className="font-semibold text-foreground">
                    {getOtherUserName(conv)}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </button>
              ))}
            </div>

            {/* Chat Area */}
            <div className="md:col-span-3 flex flex-col">
              {selectedConversation && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === currentUser.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.senderId === currentUser.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {msg.mediaUrl && (
                            <div className="mb-2">
                              {msg.mediaType === 'image' ? (
                                <img
                                  src={msg.mediaUrl}
                                  alt="Message media"
                                  className="max-w-xs rounded max-h-48"
                                />
                              ) : (
                                <video
                                  src={msg.mediaUrl}
                                  controls
                                  className="max-w-xs rounded max-h-48"
                                />
                              )}
                            </div>
                          )}
                          {msg.content && <p className="text-sm">{msg.content}</p>}
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-border p-4 space-y-3">
                    {selectedMedia && (
                      <div className="relative w-32 h-32">
                        {selectedMedia.type === 'image' ? (
                          <img
                            src={selectedMedia.url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <video
                            src={selectedMedia.url}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                        <button
                          onClick={() => setSelectedMedia(null)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 resize-none"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaSelect}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <div>
                            <Paperclip size={18} />
                          </div>
                        </Button>
                      </label>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() && !selectedMedia}
                        className="gap-2"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
