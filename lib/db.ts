// Mock database with localStorage
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  relationshipGoal: 'marriage' | 'serious' | 'dating';
  bio: string;
  photos: string[];
  videos: string[];
  interests: string[];
  location: string;
  tokens: number;
  isPremium: boolean;
  premiumExpiresAt?: number;
  createdAt: number;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  status: 'liked' | 'disliked' | 'matched';
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  lastMessage?: string;
  lastMessageTime?: number;
  createdAt: number;
}

// Initialize localStorage with mock data
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'aisha@example.com',
    password: 'password123',
    name: 'Aisha',
    age: 28,
    gender: 'female',
    relationshipGoal: 'marriage',
    bio: 'Software engineer passionate about tech and travel. Love hiking and coffee.',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
    videos: [],
    interests: ['Travel', 'Technology', 'Hiking', 'Cooking'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: '2',
    email: 'natashe@example.com',
    password: 'password123',
    name: 'Natashe',
    age: 26,
    gender: 'female',
    relationshipGoal: 'serious',
    bio: 'Doctor who loves art, music, and good conversations. Adventure seeker.',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    videos: [],
    interests: ['Art', 'Music', 'Travel', 'Reading'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    email: 'maya@example.com',
    password: 'password123',
    name: 'Maya',
    age: 25,
    gender: 'female',
    relationshipGoal: 'dating',
    bio: 'Photographer exploring the world through my lens. Coffee addict.',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
    videos: [],
    interests: ['Photography', 'Travel', 'Fashion', 'Coffee'],
    location: 'Dire Dawa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '4',
    email: 'sophia@example.com',
    password: 'password123',
    name: 'Sophia',
    age: 29,
    gender: 'female',
    relationshipGoal: 'marriage',
    bio: 'Teacher with a passion for education and community. Love outdoor activities.',
    photos: ['https://images.unsplash.com/photo-1539571696357-5a69c006ae0f?w=400'],
    videos: [],
    interests: ['Education', 'Community Service', 'Sports', 'Art'],
    location: 'Hawassa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '5',
    email: 'yodit@example.com',
    password: 'password123',
    name: 'Yodit',
    age: 27,
    gender: 'female',
    relationshipGoal: 'serious',
    bio: 'Business analyst who loves entrepreneurship and personal growth. Coffee enthusiast and weekend traveler.',
    photos: ['https://images.unsplash.com/photo-1517841905240-1455efb3ffb5?w=400'],
    videos: [],
    interests: ['Business', 'Travel', 'Fitness', 'Cooking'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: '6',
    email: 'almaz@example.com',
    password: 'password123',
    name: 'Almaz',
    age: 24,
    gender: 'female',
    relationshipGoal: 'dating',
    bio: 'Graphic designer passionate about creativity and design. Love exploring new restaurants and museums.',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
    videos: [],
    interests: ['Design', 'Art', 'Food', 'Culture'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: '7',
    email: 'getnet@example.com',
    password: 'password123',
    name: 'Getnet',
    age: 31,
    gender: 'male',
    relationshipGoal: 'marriage',
    bio: 'Engineer working in renewable energy. Passionate about sustainability and outdoor sports.',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    videos: [],
    interests: ['Technology', 'Sustainability', 'Sports', 'Travel'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: '8',
    email: 'dawit@example.com',
    password: 'password123',
    name: 'Dawit',
    age: 29,
    gender: 'male',
    relationshipGoal: 'serious',
    bio: 'Accountant with a love for numbers and travel. Enjoy hiking, reading, and good conversations.',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    videos: [],
    interests: ['Travel', 'Reading', 'Finance', 'Hiking'],
    location: 'Addis Ababa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '9',
    email: 'tadesse@example.com',
    password: 'password123',
    name: 'Tadesse',
    age: 26,
    gender: 'male',
    relationshipGoal: 'dating',
    bio: 'Marketing professional who loves creative campaigns and trying new cuisines. Always up for an adventure.',
    photos: ['https://images.unsplash.com/photo-1517841905240-1455efb3ffb5?w=400'],
    videos: [],
    interests: ['Marketing', 'Food', 'Music', 'Travel'],
    location: 'Dire Dawa',
    tokens: 10,
    isPremium: false,
    createdAt: Date.now() - 86400000 * 2,
  },
];

export class Database {
  static getUsers(): User[] {
    const stored = localStorage.getItem('ethiomatch_users');
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem('ethiomatch_users', JSON.stringify(users));
  }

  static getMatches(): Match[] {
    const stored = localStorage.getItem('ethiomatch_matches');
    return stored ? JSON.parse(stored) : [];
  }

  static saveMatches(matches: Match[]): void {
    localStorage.setItem('ethiomatch_matches', JSON.stringify(matches));
  }

  static getMessages(): Message[] {
    const stored = localStorage.getItem('ethiomatch_messages');
    return stored ? JSON.parse(stored) : [];
  }

  static saveMessages(messages: Message[]): void {
    localStorage.setItem('ethiomatch_messages', JSON.stringify(messages));
  }

  static getConversations(): Conversation[] {
    const stored = localStorage.getItem('ethiomatch_conversations');
    return stored ? JSON.parse(stored) : [];
  }

  static saveConversations(conversations: Conversation[]): void {
    localStorage.setItem('ethiomatch_conversations', JSON.stringify(conversations));
  }

  static getCurrentUser(): User | null {
    const stored = localStorage.getItem('ethiomatch_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('ethiomatch_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ethiomatch_current_user');
    }
  }

  static initializeDemoData(): void {
    // Initialize users if not present
    const users = localStorage.getItem('ethiomatch_users');
    if (!users) {
      localStorage.setItem('ethiomatch_users', JSON.stringify(DEFAULT_USERS));
    }
  }

  static useToken(userId: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;
    
    const user = users[userIndex];
    if (user.isPremium) return true; // Premium users don't use tokens
    if (user.tokens <= 0) return false;
    
    users[userIndex] = { ...user, tokens: user.tokens - 1 };
    this.saveUsers(users);
    
    // Update current user if it's the same
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    
    return true;
  }

  static canSendMessage(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    return user.isPremium || user.tokens > 0;
  }

  static upgradeToPremium(userId: string): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const user = users[userIndex];
    const updatedUser = {
      ...user,
      isPremium: true,
      premiumExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    
    users[userIndex] = updatedUser;
    this.saveUsers(users);
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(updatedUser);
    }
    
    return updatedUser;
  }

  static addTokens(userId: string, amount: number): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const user = users[userIndex];
    const updatedUser = { ...user, tokens: user.tokens + amount };
    
    users[userIndex] = updatedUser;
    this.saveUsers(users);
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(updatedUser);
    }
    
    return updatedUser;
  }

  static findUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static validatePassword(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
