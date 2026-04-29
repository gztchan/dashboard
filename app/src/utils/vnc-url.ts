// import { getConfig } from "@providence/api";

// /** WebSocket URL for Edge `/websockify` proxy (see `services/apps/edge/src/proxy/__init__.py`). */
// export function buildBrowserVncWebSocketUrl(browserId: string): string | null {
//   const edge = getConfig().edgeEndpoint?.trim();
//   if (!edge) return null;
//   try {
//     const u = new URL(edge);
//     u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
//     const path = u.pathname.replace(/\/$/, "");
//     const origin = `${u.protocol}//${u.host}${path}`;
//     return `${origin}/websockify?browser_id=${encodeURIComponent(browserId)}`;
//   } catch {
//     return null;
//   }
// }
