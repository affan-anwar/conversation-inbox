import { http, HttpResponse, delay } from "msw";
import { mockConversations } from "./data";

// this file fakes our backend API using MSW

export const handlers = [
  // GET all conversations
  http.get("/api/conversations", async () => {
    await delay(400); // fake network delay
    return HttpResponse.json(mockConversations);
  }),

  // POST to resolve one conversation
  http.post("/api/conversations/:id/resolve", async ({ params }) => {
    await delay(400);

    // randomly fail 20% of the time to test error handling
    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({
      id: params.id,
      status: "resolved",
    });
  }),
];