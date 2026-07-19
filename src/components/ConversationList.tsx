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

  // keyboard navigation: up/down to move through the list, esc to close detail
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
        return;
      }

      const currentIndex = filteredConversations.findIndex(
        (c) => c.id === selectedId
      );

      if (e.key === "ArrowDown") {
        const nextIndex =
          currentIndex === -1
            ? 0
            : Math.min(currentIndex + 1, filteredConversations.length - 1);
        setSelectedId(filteredConversations[nextIndex]?.id ?? null);
      }

      if (e.key === "ArrowUp") {
        const prevIndex =
          currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0);
        setSelectedId(filteredConversations[prevIndex]?.id ?? null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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

  // split into active and resolved so resolved items show separately
  const activeConversations = filteredConversations.filter(
    (c) => c.status !== "resolved"
  );
  const resolvedConversations = filteredConversations.filter(
    (c) => c.status === "resolved"
  );

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

      <p className="text-xs text-slate-500 mb-3">
        Tip: use the up and down arrow keys to move between conversations,
        and Esc to close the details panel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {filteredConversations.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-10 border border-dashed border-slate-800 rounded-lg">
              No conversations match this filter
            </div>
          ) : (
            <>
              {activeConversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedId}
                  onClick={() => setSelectedId(conv.id)}
                />
              ))}

              {resolvedConversations.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide">
                    Resolved
                  </p>
                  {resolvedConversations.map((conv) => (
                    <ConversationCard
                      key={conv.id}
                      conversation={conv}
                      isSelected={conv.id === selectedId}
                      onClick={() => setSelectedId(conv.id)}
                    />
                  ))}
                </div>
              )}
            </>
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