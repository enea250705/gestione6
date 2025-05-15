// Re-export the types from the shared schema
export * from "../../shared/schema.js"; 

// This is a TypeScript declaration file for the schema module
// Export the User interface and other schema types

import { z } from "zod";

// User schema for validation
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "employee"]),
  isActive: z.boolean().default(true),
});

// User interface
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date | string | null;
} 