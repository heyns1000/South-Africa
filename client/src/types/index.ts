// Re-export Express User type for client use
export interface User {
  id: number;
  email: string;
  name: string;
}

// Extend Express namespace
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
    }
  }
}
