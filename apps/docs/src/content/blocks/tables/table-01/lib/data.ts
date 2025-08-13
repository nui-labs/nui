export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export const sampleData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "inactive",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Editor",
    status: "pending",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana@example.com",
    role: "Viewer",
    status: "active",
    createdAt: "2024-01-30",
  },
  {
    id: "7",
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "Editor",
    status: "inactive",
    createdAt: "2024-01-12",
  },
  {
    id: "8",
    name: "Frank Taylor",
    email: "frank@example.com",
    role: "Viewer",
    status: "pending",
    createdAt: "2024-02-01",
  },
];

export const roles = ["Admin", "Editor", "Viewer"] as const;
export const statuses = ["active", "inactive", "pending"] as const;

export type Role = (typeof roles)[number];
export type Status = (typeof statuses)[number];
