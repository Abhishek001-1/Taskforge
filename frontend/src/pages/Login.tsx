import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Mail, Sparkles, User, UserPlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function Login() {
  const { login, signup, googleLogin } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleInitialized = useRef(false);

  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
        await googleLogin(response.credential);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [googleLogin],
  );

  useEffect(() => {
    const renderGoogleButton = () => {
      if (!window.google || !googleBtnRef.current) return;

      // Only call initialize once to avoid GSI_LOGGER warnings
      if (!googleInitialized.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleCredential,
        });
        googleInitialized.current = true;
      }

      // Clear previous button content and re-render
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "pill",
      });
    };

    // If GSI is already loaded, render immediately
    if (window.google) {
      renderGoogleButton();
      return;
    }

    // Otherwise wait for the GSI script to load
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);
      return () => existingScript.removeEventListener("load", renderGoogleButton);
    }
  }, [handleGoogleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background: "var(--bg)",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 10% -10%, rgb(91 92 226 / 0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 5%, rgb(61 139 253 / 0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% 100%, rgb(167 139 250 / 0.10) 0%, transparent 60%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Glass card */}
        <div
          className="overflow-hidden rounded-3xl border"
          style={{
            background: "var(--panel)",
            borderColor: "var(--line)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Header */}
          <div
            className="relative px-8 pb-6 pt-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgb(91 92 226 / 0.08), rgb(61 139 253 / 0.06))",
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{
                background: "linear-gradient(135deg, #5b5ce2, #3d8bfd)",
                boxShadow: "0 8px 24px rgb(91 92 226 / 0.4)",
              }}
            >
              <Sparkles size={28} />
            </motion.div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--ink)" }}
            >
              TaskForge
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted)" }}
            >
              Your daily interview prep tracker
            </p>
          </div>

          {/* Tab toggle */}
          <div className="px-8 pt-6">
            <div
              className="flex rounded-2xl p-1"
              style={{ background: "var(--panel-3)" }}
            >
              {[false, true].map((tab) => (
                <button
                  key={tab ? "signup" : "login"}
                  onClick={() => {
                    setIsSignup(tab);
                    setError("");
                  }}
                  className="relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                  style={{
                    color: isSignup === tab ? "white" : "var(--muted)",
                  }}
                >
                  {isSignup === tab && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #5b5ce2, #4546c8)",
                        boxShadow: "0 4px 14px rgb(91 92 226 / 0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tab ? <UserPlus size={15} /> : <LogIn size={15} />}
                    {tab ? "Sign Up" : "Log In"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-5" autoComplete="off">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    background: "rgb(239 68 68 / 0.1)",
                    color: "#ef4444",
                    border: "1px solid rgb(239 68 68 / 0.2)",
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3.5">
              <AnimatePresence mode="wait">
                {isSignup && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--muted-2)" }}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        name="tf-display-name"
                        autoComplete="one-time-code"
                        className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                        style={{
                          background: "var(--panel-2)",
                          borderColor: "var(--line)",
                          color: "var(--ink)",
                        }}
                        onFocus={(e) => (e.target.style.boxShadow = "var(--shadow-glow)")}
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--muted-2)" }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    name="tf-email-input"
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "var(--shadow-glow)")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5"
                    style={{ color: "var(--muted-2)" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    name="tf-pass-input"
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border py-3 pl-4 pr-10 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "var(--shadow-glow)")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #5b5ce2, #3d8bfd)",
                boxShadow: "0 4px 14px rgb(91 92 226 / 0.4)",
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <>
                  {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
                  {isSignup ? "Create Account" : "Log In"}
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "var(--line)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--muted-2)" }}>
                or
              </span>
              <div className="h-px flex-1" style={{ background: "var(--line)" }} />
            </div>

            {/* Google button */}
            <div className="flex justify-center">
              <div ref={googleBtnRef} />
            </div>

            {/* No Google client ID fallback */}
            {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <p
                className="mt-3 text-center text-xs"
                style={{ color: "var(--muted-2)" }}
              >
                Google login requires{" "}
                <code
                  className="rounded px-1 py-0.5 text-[10px]"
                  style={{ background: "var(--panel-3)" }}
                >
                  VITE_GOOGLE_CLIENT_ID
                </code>{" "}
                in .env
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--muted-2)" }}
        >
          Built with ✨ for interview prep mastery
        </p>
      </motion.div>
    </div>
  );
}
