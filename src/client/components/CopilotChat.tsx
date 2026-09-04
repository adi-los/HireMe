import React, { useEffect, useRef, useState } from "react";
import { Heading } from "@servicenow/react-components/Heading";
import { Button } from "@servicenow/react-components/Button";
import { Textarea } from "@servicenow/react-components/Textarea";
import { Loader } from "@servicenow/react-components/Loader";
import type { ServiceNowEvent } from "@servicenow/react-components/utils/events";
import { fetchChatHistory } from "../services/tableApi";
import { askCopilot } from "../services/copilotApi";

/**
 * RH Copilot chat panel (blueprint p.12), embedded in ApplicationDetail.
 * Scoped to one application only — never lets the recruiter ask about, or
 * see, any other candidate (ai-agents-brief.md Q4).
 *
 * Deliberately built from plain components (Heading/Button/Textarea/Loader),
 * not the `useRecord`-based "connected" family — see the note in CLAUDE.md
 * on why those crash on a bare UI Page. `Badge` was considered for the
 * citation tags but its own type declaration (`Badge.d.ts`) shows it's a
 * numeric notification counter (`value: number`), not a text chip — plain
 * styled spans are used instead rather than force a component into a shape
 * it wasn't built for.
 */

interface Turn {
  role: "user" | "assistant";
  message: string;
  citations: string[];
}

interface Props {
  applicationId: string;
}

export default function CopilotChat({ applicationId }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTurns([]);
    setHistoryLoaded(false);
    fetchChatHistory(applicationId)
      .then(rows => {
        setTurns(
          rows.map(row => ({
            role: row.role.value as "user" | "assistant",
            message: row.message.value || row.message.display_value || "",
            citations: parseCitations(row.citations.value),
          }))
        );
      })
      .catch(e => setError(e.message))
      .finally(() => setHistoryLoaded(true));
  }, [applicationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, asking]);

  const submit = () => {
    const q = question.trim();
    if (!q || asking) return;
    setError(null);
    setAsking(true);
    setTurns(prev => [...prev, { role: "user", message: q, citations: [] }]);
    setQuestion("");

    askCopilot(applicationId, q)
      .then(res => {
        setTurns(prev => [...prev, { role: "assistant", message: res.answer, citations: res.citations || [] }]);
      })
      .catch(e => setError(e.message))
      .finally(() => setAsking(false));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "420px" }}>
      <Heading level={2} label="RH Copilot" />
      <p style={{ margin: "4px 0 12px", color: "var(--now-color--text-secondary, #62676f)", fontSize: "13px" }}>
        Answers are grounded in this application only.
      </p>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
          padding: "12px",
          background: "#fafafa",
          minHeight: "260px",
        }}
      >
        {!historyLoaded && <Loader label="Loading conversation..." />}
        {historyLoaded && turns.length === 0 && (
          <p style={{ color: "#888", fontSize: "13px" }}>
            Ask about this candidate's skills, experience, or score — e.g. "Why did they score low on logistics fit?"
          </p>
        )}
        {turns.map((turn, i) => (
          <ChatBubble key={i} turn={turn} />
        ))}
        {asking && <Loader label="Thinking..." />}
      </div>

      {error && (
        <p style={{ color: "#c0392b", fontSize: "13px", margin: "8px 0 0" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Textarea
            label="Ask the Copilot"
            placeholder="Ask a question about this candidate..."
            value={question}
            onInput={(e: ServiceNowEvent<{ fieldValue: string }>) => setQuestion(e.detail.payload.fieldValue)}
            rows={2}
          />
        </div>
        <Button label="Ask" variant="primary" disabled={asking || !question.trim()} onClicked={submit} />
      </div>
    </div>
  );
}

function ChatBubble({ turn }: { turn: Turn }) {
  const isUser = turn.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", margin: "8px 0" }}>
      <div
        style={{
          maxWidth: "80%",
          background: isUser ? "#0a5cd6" : "#ffffff",
          color: isUser ? "#ffffff" : "#1a1a1a",
          border: isUser ? "none" : "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "8px 12px",
          whiteSpace: "pre-wrap",
          fontSize: "14px",
        }}
      >
        {turn.message}
        {turn.citations.length > 0 && (
          <div style={{ marginTop: "6px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {turn.citations.map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "999px",
                  background: isUser ? "rgba(255,255,255,0.2)" : "#eef1f5",
                  color: isUser ? "#ffffff" : "#4a4f57",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function parseCitations(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
