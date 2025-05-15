import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<any> {
  const url = `/api${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null;
    }
    
    // For other responses, try to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      
      // If response is not ok, throw an error with the response data
      if (!response.ok) {
        throw new Error(json.message || "API request failed");
      }
      
      return json;
    }
    
    // If response is not JSON, just return the response
    if (!response.ok) {
      throw new Error("API request failed");
    }
    
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
