# Conversation Inbox

A triage inbox that helps CX agents quickly find and act on the customer
conversations that need a human the most.

## Setup

```bash
git clone https://github.com/affan-anwar/conversation-inbox.git
cd conversation-inbox
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Product thinking

CX agents open their queue every morning to a wall of escalated conversations.
The problem isn't that they don't know how to help — it's that they can't
tell, at a glance, which conversation needs them **right now**.

I focused on three things an agent needs in the first few seconds:

1. **What's urgent** — conversations are sorted by priority (critical first),
   and priority is shown as a colored badge instead of a dot, so it's
   scannable without reading text.
2. **Why it's here** — every card shows the escalation reason, so the agent
   doesn't have to open the conversation just to understand why the bot
   couldn't handle it.
3. **A way to narrow the queue** — filter chips let the agent focus on just
   the critical/high items when the queue is long.

Clicking a conversation opens a detail panel with a **Resolve** action. This
is the one write action in the assignment, and it can fail (about 20% of the
time) to simulate a real network/backend failure — the UI shows an error and
lets the agent retry instead of silently failing.

## What I chose not to build

I scoped this to fit the ~2 evening budget instead of building everything I
could think of. Specifically I left out:


- **Auth / agent assignment / multiple queues** — explicitly out of scope in
  the brief, and would need a real backend to be meaningful.
- **Real AI sentiment/summary features** — I could fake a sentiment score in
  the UI, but it wouldn't be backed by anything real, and I'd rather not ship
  a number I can't explain.
- **Search bar** — useful, but the priority filter covers the main "find what
  matters" need for a queue of this size. If the queue were in the hundreds,
  search would be the next thing I'd add.

## Architecture

    src/
      components/
        ConversationCard.tsx    - one row in the list
        ConversationList.tsx    - fetches data, handles sort/filter/keyboard nav
        ConversationDetail.tsx  - detail panel + resolve action
      mocks/
        data.ts       - mock conversations
        handlers.ts   - MSW request handlers (GET list, POST resolve)
        browser.ts    - starts the MSW worker
      types/
        conversation.ts - shared types

- Data fetching happens with a plain `fetch()` call, no extra data-fetching
  library, since the amount of state here didn't need one.
- MSW intercepts the network call in the browser so the UI behaves like it's
  talking to a real API, including the delay and the possibility of failure.
- State is kept local to `ConversationList` (conversations, loading, error,
  selected id, active filter) since nothing here needs to be shared outside
  this part of the tree yet.
## Known limitations

- No pagination — fine for the small mock dataset, would need it for a real
  queue.
- No persistence — resolving a conversation only updates local state; a
  refresh resets it, since there's no real backend.
- Keyboard navigation is basic (up/down/esc) and doesn't yet support jumping
  by first letter or other shortcuts.
- No automated tests yet — given the time budget I prioritized the core flow
  and states over test coverage.

## Time spent

Roughly 2 evenings (~5-6 hours), split across:
- Project setup, mock API, types (~1 hr)
- List, card, loading/error/empty states (~1.5 hrs)
- Detail panel + resolve action (~1.5 hrs)
- Filter chips + keyboard nav + polish (~1.5 hrs)