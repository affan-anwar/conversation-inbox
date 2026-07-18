import ConversationList from "./components/ConversationList";

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-semibold text-white">
          Conversation Inbox
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Escalated conversations that need your attention
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <ConversationList />
      </main>
    </div>
  );
}

export default App;