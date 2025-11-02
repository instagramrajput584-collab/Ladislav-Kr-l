
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  author: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
}

export interface Holiday {
    name: string;
    description: string;
}

export interface NameDay {
    name: string;
}

export interface CalendarEventData {
    holidays: Holiday[];
    nameDays: NameDay[];
    observances: string[];
    notes?: string;
}

export interface FullNameDay {
    date: string; // e.g., "01-15"
    names: string[];
}
