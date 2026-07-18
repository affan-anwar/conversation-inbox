import { useState } from "react";
import type { Conversation } from "../types/conversation";

type Props = {
  conversation: Conversation;
  onResolved: (id: string) => void;
  onClose: () => void;
};

function ConversationDetail({ conversation, onResolved, onClose }: Props) {
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(false);

  async function handleResolve() {
    setResolving(true);
    setResolveError(false);

    try {
      const res = await fetch(
        `/api/conversations/${conversation.id}/resolve`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error("Failed to resolve");
      }

      // let the parent know so it can update the list
      onResolved(conversation.id);
    } catch (err) {
      console.log("resolve failed", err);
      setResolveError(true);
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 sticky top-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {conversation.customerName}
          </h2>
          <p className="text-xs text-slate-500">
            Waiting {conversation.waitTimeMinutes} min
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white text-sm"
        >
          Close
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-1">Last message</p>
        <p className="text-sm text-slate-200">{conversation.lastMessage}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-1">Escalation reason</p>
        <p className="text-sm text-slate-300">
          {conversation.escalationReason}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-1">Status</p>
        <p className="text-sm text-slate-300 capitalize">
          {conversation.status.replace("_", " ")}
        </p>
      </div>

      {resolveError && (
        <p className="text-sm text-red-400 mb-3">
          Could not resolve this conversation. Please try again.
        </p>
      )}

      {conversation.status === "resolved" ? (
        <p className="text-sm text-green-400">
          This conversation is resolved.
        </p>
      ) : (
        <button
          onClick={handleResolve}
          disabled={resolving}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {resolving ? "Resolving..." : "Resolve Conversation"}
        </button>
      )}
    </div>
  );
}

export default ConversationDetail;