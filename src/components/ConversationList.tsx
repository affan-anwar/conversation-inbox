import { useEffect, useState } from "react";
import type { Conversation, Priority } from "../types/conversation";
import ConversationCard from "./ConversationCard";
import ConversationDetail from "./ConversationDetail";

const priorityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// the filter options shown as chips above the list
const filterOptions: { label: string; value: Priority | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Priority | "all">("all");

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/conversations");

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data: Conversation[] = await res.json();

      const sorted = [...data].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );

      setConversations(sorted);
    } catch (err) {
      console.log("fetch failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleResolved(id: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c))
    );
  }

  if (loading) {
    return (
      <div className="text-slate-400 text-center py-10">
        Loading conversations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 mb-3">Failed to load conversations.</p>
        <button
          onClick={fetchConversations}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-slate-400 text-center py-10">
        No conversations in the queue right now
      </div>
    );
  }

  // apply the active priority filter to the list
  const filteredConversations =
    activeFilter === "all"
      ? conversations
      : conversations.filter((c) => c.priority === activeFilter);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div>
      {/* filter chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {filteredConversations.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-10 border border-dashed border-slate-800 rounded-lg">
              No conversations match this filter
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                onClick={() => setSelectedId(conv.id)}
              />
            ))
          )}
        </div>

        <div className="md:col-span-1">
          {selectedConversation ? (
            <ConversationDetail
              conversation={selectedConversation}
              onResolved={handleResolved}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="text-slate-500 text-sm text-center py-10 border border-dashed border-slate-800 rounded-lg">
              Select a conversation to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConversationList;