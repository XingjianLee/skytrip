export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
  pinned?: boolean;
  messages: ChatMessage[];
}

const KEY = "conversations";

export function listConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Conversation[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAll(convs: Conversation[]) {
  localStorage.setItem(KEY, JSON.stringify(convs));
}

export function createConversation(title: string): Conversation {
  const convs = listConversations();
  const now = Date.now();
  const conv: Conversation = {
    id: String(now),
    title: title || "未命名对话",
    created_at: now,
    updated_at: now,
    messages: [],
  };
  saveAll([conv, ...convs]);
  return conv;
}

export function updateConversation(id: string, patch: Partial<Conversation>): Conversation | null {
  const convs = listConversations();
  const idx = convs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated: Conversation = { ...convs[idx], ...patch, updated_at: Date.now() };
  const next = [...convs];
  next[idx] = updated;
  saveAll(next);
  return updated;
}

export function saveMessages(id: string, messages: ChatMessage[]) {
  updateConversation(id, { messages });
}

export function deleteConversation(id: string) {
  const convs = listConversations().filter((c) => c.id !== id);
  saveAll(convs);
}

export function renameConversation(id: string, title: string) {
  updateConversation(id, { title });
}

export function togglePin(id: string) {
  const convs = listConversations();
  const c = convs.find((x) => x.id === id);
  if (!c) return;
  updateConversation(id, { pinned: !c.pinned });
}

