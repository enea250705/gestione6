import { useAuth as useAuthHook } from "@/contexts/auth-context";

export function useAuth() {
  return useAuthHook();
}
