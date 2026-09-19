import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Enter an email and password to continue."); return; }
    if (mode === "create" && !form.name) { setError("Tell us your name to create an account."); return; }
    setError("");
    navigate("/");
  };

  return (
    <div className="login">
      <div className="login__panel">
        <h1>{mode === "signin" ? "Welcome back" : "Create an account"}</h1>
        <p className="login__sub">
          {mode === "signin" ? "Sign in to see your orders and saved pieces." : "Save pieces, track orders, checkout faster."}
        </p>
        <div className="shelf login__rule" />
        {error && <p className="login__error">{error}</p>}
        <form onSubmit={handleSubmit} className="login__form">
          {mode === "create" && (
            <label>Name
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jordan Blake" />
            </label>
          )}
          <label>Email
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>Password
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </label>
          <button type="submit" className="btn login__submit">{mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        <p className="login__switch">
          {mode === "signin" ? (
            <>New here? <button onClick={() => setMode("create")}>Create an account</button></>
          ) : (
            <>Already have one? <button onClick={() => setMode("signin")}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
export default Login;
