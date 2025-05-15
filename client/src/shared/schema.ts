// User types
export interface User {
  id: number;
  name: string;
  username?: string;
  email?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export interface InsertUser {
  username: string;
  password: string;
  name: string;
  email?: string;
  role: string;
  isActive: boolean;
}

// Schedule types
export interface Schedule {
  id: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface InsertSchedule {
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

// Shift types
export interface Shift {
  id: number;
  scheduleId: number;
  userId: number;
  employeeId?: number;
  day: string;
  date?: string;
  startTime: string;
  endTime: string;
  type: string;
  notes?: string;
  area?: string;
}

export interface InsertShift {
  scheduleId: number;
  userId: number;
  day: string;
  startTime: string;
  endTime: string;
  type: string;
  notes?: string;
  area?: string;
}

// Time off request types
export interface TimeOffRequest {
  id: number;
  userId: number;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason?: string;
  approvedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InsertTimeOffRequest {
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason?: string;
}

// Document types
export interface Document {
  id: number;
  userId: number;
  type: string;
  period: string;
  uploadedAt: string;
  fileData: string;
  filename?: string;
}

export interface InsertDocument {
  userId: number;
  type: string;
  period: string;
  fileData: string;
  filename?: string;
}

// Notification types
export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: string;
}

export interface InsertNotification {
  userId: number;
  type: string;
  message: string;
  data?: any;
}

// Message types
export interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  subject: string;
  content: string;
  isRead: boolean;
  relatedToShiftId?: number;
  createdAt: string;
}

export interface InsertMessage {
  fromUserId: number;
  toUserId: number;
  subject: string;
  content: string;
  relatedToShiftId?: number;
}

// Schema for user insertion validation
export const insertUserSchema = {
  username: { type: 'string', minLength: 3, maxLength: 50 },
  password: { type: 'string', minLength: 6 },
  name: { type: 'string', minLength: 2, maxLength: 100 },
  email: { type: 'string', format: 'email', optional: true },
  role: { type: 'string', enum: ['admin', 'employee'] },
  isActive: { type: 'boolean' }
}; 