import type { Conversation } from "../types/conversation";

type Props = {
  conversation: Conversation;
  onClick: () => void;
  isSelected: boolean;
};

// priority badge colors, mapped to what looked readable on dark bg
function getPriorityStyle(priority: string) {
  if (priority === "critical") {
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  }
  if (priority === "high") {
    return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
  }
  if (priority === "medium") {
    return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
  }
  return "bg-slate-500/15 text-slate-400 border border-slate-500/30";
}

function ConversationCard({ conversation, onClick, isSelected }: Props) {
  const priorityStyle = getPriorityStyle(conversation.priority);

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900 border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
        isSelected
          ? "border-purple-500"
          : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-medium">{conversation.customerName}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${priorityStyle}`}
            >
              {conversation.priority}
            </span>
          </div>

          <p className="text-sm text-slate-300 truncate">
            {conversation.lastMessage}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {conversation.escalationReason}
          </p>
        </div>

        <span className="text-xs text-slate-500 whitespace-nowrap">
          {conversation.waitTimeMinutes} min
        </span>
      </div>
    </div>
  );
}

export default ConversationCard;