// client/src/components/ChatBot/ChatBot.jsx
//
// "Setu Assistant" — a small, fixed-script helper that answers common
// questions and walks students to the right page. No backend and no free-text
// parsing: every reply comes from src/data/chatbotData.js, so it works on the
// static build and can never answer wrongly.
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/gyansetu-logo.webp";
import { useUserProfile } from "../../hooks/useUserProfile";
import { CHAT_TOPICS } from "../../data/chatbotData";
import "./chatbot.css";

const SEEN_KEY = "gs_chat_seen";
const TYPING_MS = 520;

export default function ChatBot() {
  const navigate = useNavigate();
  const { profile, openModal } = useUserProfile();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  // Read straight into the initial state: this is a client-only static app, so
  // there is no server render for localStorage to disagree with.
  const [hinted, setHinted] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const threadRef = useRef(null);
  const timersRef = useRef([]);
  const messageIdRef = useRef(0);

  const nextId = () => {
    messageIdRef.current += 1;
    return messageIdRef.current;
  };

  // Clear any pending "typing" timers if the component goes away mid-reply.
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const say = useCallback((message) => {
    setMessages((current) => [...current, { id: nextId(), ...message }]);
  }, []);

  /** Bot replies land after a short "typing" beat, which reads as deliberate. */
  const reply = useCallback(
    (message) => {
      setTyping(true);
      const timer = setTimeout(() => {
        setTyping(false);
        say({ from: "bot", ...message });
      }, TYPING_MS);
      timersRef.current.push(timer);
    },
    [say]
  );

  const toggle = () => {
    const opening = !open;
    setOpen(opening);

    if (!opening) return;

    if (hinted) {
      setHinted(false);
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // storage unavailable (private mode) — the pulse just comes back
      }
    }

    if (messages.length === 0) {
      const name = profile?.name ? `, ${profile.name}` : "";
      reply({
        paragraphs: [
          `Hi${name}! I'm the Setu Assistant.`,
          "Pick any question below and I'll answer it or take you straight to the right page.",
        ],
      });
    }
  };

  const askTopic = (topic) => {
    say({ from: "user", paragraphs: [topic.question] });
    reply({ paragraphs: topic.answer, actions: topic.actions });
  };

  /** Runs one reply action — either a route to visit, or a function to call
   * (currently just opening the settings modal) — closing the chat either way
   * so it doesn't sit on top of whatever comes next. */
  const runAction = (action) => {
    setOpen(false);
    if (action.action === "open-profile") {
      openModal();
      return;
    }
    if (action.to) navigate(action.to);
  };

  return (
    <div className="gs-chat">
      {open && (
        <section className="gs-chat__panel" role="dialog" aria-label="Setu Assistant">
          <header className="gs-chat__header">
            <img src={logo} alt="" className="gs-chat__avatar" />
            <div className="gs-chat__identity">
              <strong>Setu Assistant</strong>
              <span>Here to help you find your way</span>
            </div>
            <button
              type="button"
              className="gs-chat__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="gs-chat__thread" ref={threadRef}>
            {messages.map((message) => (
              <div key={message.id} className={`gs-chat__msg gs-chat__msg--${message.from}`}>
                {message.from === "bot" && (
                  <img src={logo} alt="" className="gs-chat__msg-avatar" />
                )}
                <div className="gs-chat__bubble">
                  {message.paragraphs.map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}

                  {message.actions?.length > 0 && (
                    <div className="gs-chat__actions">
                      {message.actions.map((action) => (
                        <button
                          key={action.to || action.action || action.label}
                          type="button"
                          className="gs-chat__action"
                          onClick={() => runAction(action)}
                        >
                          <span>{action.label}</span>
                          <span className="material-symbols-outlined">
                            {action.action === "open-profile" ? "settings" : "arrow_forward"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="gs-chat__msg gs-chat__msg--bot">
                <img src={logo} alt="" className="gs-chat__msg-avatar" />
                <div className="gs-chat__bubble gs-chat__bubble--typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <div className="gs-chat__chips">
            <p className="gs-chat__chips-label">
              {messages.length > 1 ? "Ask something else" : "Popular questions"}
            </p>
            <div className="gs-chat__chips-row">
              {CHAT_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className="gs-chat__chip"
                  onClick={() => askTopic(topic)}
                  disabled={typing}
                >
                  {topic.question}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`gs-chat__launcher ${open ? "is-open" : ""}`}
        onClick={toggle}
        aria-label={open ? "Close Setu Assistant" : "Open Setu Assistant — ask a question"}
        aria-expanded={open}
      >
        {hinted && !open && <span className="gs-chat__launcher-ring" aria-hidden="true" />}
        <span className="gs-chat__launcher-face">
          <img src={logo} alt="" className="gs-chat__launcher-logo" />
          <span className="material-symbols-outlined gs-chat__launcher-x">close</span>
        </span>
      </button>
    </div>
  );
}
