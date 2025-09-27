import { NextRequest } from "next/server";
import { wsManager } from "@/lib/ws/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const projectId = searchParams.get("projectId");

  if (!userId) {
    return new Response("Authentication required", { status: 401 });
  }

  // Return WebSocket connection info
  return new Response(JSON.stringify({
    url: `${process.env.WEBSOCKET_URL}?userId=${userId}&projectId=${projectId || ""}`,
    connectedUsers: wsManager.getConnectedUsers(),
    projectUsers: projectId ? wsManager.getProjectUsers(projectId) : [],
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
