'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Message, Database } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ImageIcon, Video, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  currentUser: User;
  otherUser: User;
  conversationId: string;
}

export function ChatInterface({ currentUser, otherUser, conversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allMessages = Database.getMessages();
    const conversationMessages = allMessages.filter((m) => m.conversationId === conversationId);
    setMessages(conversationMessages.sort((a, b) => a.createdAt - b.createdAt));

    // Mark messages as read
    const updated = allMessages.map((m) =>
      m.conversationId === conversationId && m.receiverId === currentUser.id
        ? { ...m, read: true }
        : m
    );
    Database.saveMessages(updated);
  }, [conversationId, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !mediaPreview) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: newMessage,
      mediaUrl: mediaPreview?.url,
      mediaType: mediaPreview?.type,
      createdAt: Date.now(),
      read: false,
    };

    const allMessages = Database.getMessages();
    allMessages.push(message);
    Database.saveMessages(allMessages);

    setMessages([...messages, message]);
    setNewMessage('');
    setMediaPreview(null);
  };

  const handleFileSelect = (file: File, type: 'image' | 'video') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setMediaPreview({ url, type });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-900">{otherUser.name}</h2>
        <p className="text-sm text-gray-600">{otherUser.location}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === currentUser.id
                    ? 'bg-red-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.mediaUrl && msg.mediaType === 'image' && (
                  <img
                    src={msg.mediaUrl}
                    alt="Sent image"
                    className="max-w-xs rounded-lg mb-2"
                  />
                )}
                {msg.mediaUrl && msg.mediaType === 'video' && (
                  <video
                    src={msg.mediaUrl}
                    controls
                    className="max-w-xs rounded-lg mb-2"
                  />
                )}
                {msg.content && <p className="text-sm">{msg.content}</p>}
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id ? 'text-white/70' : 'text-gray-600'
                  }`}
                >
                  {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Media Preview */}
        {mediaPreview && (
          <div className="relative inline-block">
            {mediaPreview.type === 'image' ? (
              <img
                src={mediaPreview.url}
                alt="Preview"
                className="max-w-xs rounded-lg"
              />
            ) : (
              <video
                src={mediaPreview.url}
                className="max-w-xs rounded-lg"
                controls
              />
            )}
            <button
              onClick={() => setMediaPreview(null)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Field */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <label className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0], 'image');
                }
              }}
              className="hidden"
            />
          </label>
          <label className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition">
            <Video className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0], 'video');
                }
              }}
              className="hidden"
            />
          </label>
          <Button
            onClick={handleSendMessage}
            className="bg-red-500 hover:bg-red-600 text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
