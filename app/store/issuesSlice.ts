import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";
export type IssueCategory =
  | "Electrical"
  | "Water Supply"
  | "Roads"
  | "Waste"
  | "Safety"
  | "Others";

export type Issue = {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  reporter: string;
  imageUrl: string;
};

// ใช้สำหรับหน้า Insights
export type ActivityLog = {
  id: number;
  message: string; // เช่น marked "Pothole..." as Resolved
  time: string; // เวลาเป็น string ไว้โชว์เลย
};

const initialIssues: Issue[] = [
  {
    id: 1,
    title: "Street Light Broken at Main St. & 5th Ave",
    location: "Main St. & 5th Ave",
    date: "11/14/2025",
    description:
      "Reported issue concerning street light broken. Ideally requires immediate inspection to prevent accidents.",
    category: "Electrical",
    status: "Pending",
    reporter: "Citizen A",
    imageUrl: "/assets/issues/issue-1.avif",
  },
  {
    id: 2,
    title: "Water Pipe Burst at Central Park Entrance",
    location: "Central Park Entrance",
    date: "11/12/2025",
    description:
      "Reported issue concerning water pipe burst. May cause flooding and water supply disruption.",
    category: "Water Supply",
    status: "Pending",
    reporter: "Citizen B",
    imageUrl: "/assets/issues/issue-2.avif",
  },
  {
    id: 3,
    title: "Manhole Cover Missing at Downtown Market",
    location: "Downtown Market",
    date: "08/19/2025",
    description:
      "Reported manhole cover missing. Immediate attention needed to avoid accidents for pedestrians and vehicles.",
    category: "Roads",
    status: "Pending",
    reporter: "Citizen C",
    imageUrl: "/assets/issues/issue-3.jpg",
  },
  {
    id: 4,
    title: "Overflowing Trash at School Zone A",
    location: "School Zone A",
    date: "11/14/2025",
    description:
      "Reported overflowing trash near the school area. Could impact hygiene and student safety.",
    category: "Waste",
    status: "Pending",
    reporter: "Citizen D",
    imageUrl: "/assets/issues/issue-4.avif",
  },
  {
    id: 5,
    title: "Fallen Tree at Riverside Walkway",
    location: "Riverside Walkway",
    date: "08/19/2025",
    description:
      "Reported fallen tree blocking pedestrian walkway. Requires urgent clearing for safe passage.",
    category: "Safety",
    status: "Pending",
    reporter: "Citizen E",
    imageUrl: "/assets/issues/issue-5.avif",
  },
  {
    id: 6,
    title: "Pothole on Road at Block 5, Sector 2",
    location: "Block 5, Sector 2",
    date: "08/12/2025",
    description:
      "Reported large pothole on main road. Could damage vehicles and cause traffic issues.",
    category: "Others",
    status: "In Progress",
    reporter: "Citizen F",
    imageUrl: "/assets/issues/issue-6.avif",
  },
  {
    id: 7,
    title: "Flooding Under Highway Exit 12",
    location: "Highway Exit 12",
    date: "09/02/2025",
    description:
      "Heavy water accumulation during rain causing hazardous driving conditions.",
    category: "Roads",
    status: "Pending",
    reporter: "Citizen G",
    imageUrl: "/assets/issues/issue-7.avif",
  },
  {
    id: 8,
    title: "Broken Guardrail at Riverside Curve",
    location: "Riverside Curve",
    date: "10/01/2025",
    description:
      "Damaged guardrail along sharp curve by the river. Needs repair to ensure driver safety.",
    category: "Safety",
    status: "In Progress",
    reporter: "Citizen H",
    imageUrl: "/assets/issues/issue-8.jpg",
  },
  {
    id: 9,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
  {
    id: 10,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
  {
    id: 11,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
  {
    id: 12,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
  {
    id: 13,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
];

type IssuesState = {
  items: Issue[];
  logs: ActivityLog[];
};

const initialState: IssuesState = {
  items: initialIssues,
  logs: [],
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    addIssue: (state, action: PayloadAction<Omit<Issue, "id">>) => {
      const nextId =
        state.items.length > 0
          ? Math.max(...state.items.map((i) => i.id)) + 1
          : 1;

      const newIssue: Issue = { ...action.payload, id: nextId };
      state.items.push(newIssue);

      // log การสร้าง issue ใหม่
      state.logs.unshift({
        id: Date.now(),
        message: `created "${newIssue.title}"`,
        time: new Date().toLocaleString(),
      });
    },

    updateIssue: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Issue> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.items.findIndex((i) => i.id === id);
      if (index === -1) return;

      const prev = state.items[index];
      const updated: Issue = { ...prev, ...data };
      state.items[index] = updated;

      // ถ้ามีการเปลี่ยน status ให้ log ไว้
      if (data.status && data.status !== prev.status) {
        state.logs.unshift({
          id: Date.now(),
          message: `marked "${updated.title}" as ${updated.status}`,
          time: new Date().toLocaleString(),
        });
      }
    },

    deleteIssue: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const target = state.items.find((i) => i.id === id);

      if (target) {
        state.logs.unshift({
          id: Date.now(),
          message: `deleted "${target.title}"`,
          time: new Date().toLocaleString(),
        });
      }

      state.items = state.items.filter((issue) => issue.id !== id);
    },
  },
});

export const { addIssue, updateIssue, deleteIssue } = issuesSlice.actions;
export default issuesSlice.reducer;
