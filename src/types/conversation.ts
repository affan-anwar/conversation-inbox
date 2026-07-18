// Types for a single conversation in the inbox

export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "waiting" | "in_progress" | "resolved";

export interface Conversation {
    id: string;
    customerName: string;
    lastMessage: string;
    waitTimeMinutes: number;
    priority: Priority;
    sentimentScore: number;
    escalationReason: string;
    status: Status;
}