import type { Conversation } from "../types/conversation";

// this component shows one conversation row in the list
// took the priority colors from tailwind docs and picked what looked good

type Props = {
  conversation: Conversation;
  onClick: () => void;
};

function getPriorityColor(priority: string) {
  if (priority === "critical") return "bg-red-500";
  if (priority === "high") return "bg-orange-500";
  if (priority === "medium") return "bg-yellow-500";
  return "bg-gray-400";
}

function ConversationCard({ conversation, onClick }: Props) {
  const priorityColor = getPriorityColor(conversation.priority);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
    >
      <span className={`w-2 h-2 rounded-full ${priorityColor}`}></span>

      <div className="flex-1 text-left">
        <div className="flex justify-between items-center">
          <p className="text-white font-medium">{conversation.customerName}</p>
          <span className="text-xs text-slate-400">
            {conversation.waitTimeMinutes} min
          </span>
        </div>
        <p className="text-sm text-slate-400 truncate">
          {conversation.lastMessage}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {conversation.escalationReason}
        </p>
      </div>
    </div>
  );
}

export default ConversationCard;