import { useState } from "react";
import { login, register } from "../api/auth.api";

export default function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onAuthed();
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>
        {mode === "login" ? "Sign in" : "Create account"}
      </h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        {error ? (
          <div style={{ color: "crimson", fontSize: 14 }}>{error}</div>
        ) : null}

        <button disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        {mode === "login" ? (
          <button type="button" onClick={() => setMode("register")}>
            Need an account? Register
          </button>
        ) : (
          <button type="button" onClick={() => setMode("login")}>
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );
}
