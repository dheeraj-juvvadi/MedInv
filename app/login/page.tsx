"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Package,
  FileText,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeadowScene } from "@/components/meadow-scene";
import { FineGrainPattern } from "@/components/ui/fine-grain-pattern";
import { Brand } from "@/components/sidebar";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const demo = process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "demo";
  async function signIn(user: string, pass: string) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not sign in. Please try again.");
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect. Please try again.",
      );
      setLoading(false);
    }
  }
  return (
    <FineGrainPattern className="login-page">
      <div className="login-hero" id="sign-in">
        <header className="login-header">
          <Brand />
          <a
            href="https://github.com/dheeraj-juvvadi/MedInv"
            target="_blank"
            rel="noreferrer"
          >
            Open source
            <ArrowUpRight size={14} />
          </a>
        </header>
        <MeadowScene className="login-landscape" />
        <div className="login-center">
          <div className="login-app-icon" aria-hidden="true">
            <Plus size={47} strokeWidth={4} />
          </div>
          <h1>MedInv</h1>
          <p className="login-caption">
            Your medical inventory. One workspace.
          </p>
          <section className="login-window" aria-labelledby="sign-in-heading">
            <div className="login-window-heading">
              <span className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <h2 id="sign-in-heading">Sign in</h2>
              <span className="window-shortcut" aria-hidden="true">
                ↵
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void signIn(username, password);
              }}
              className="login-form"
            >
              <div>
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="icon-control"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading} className="login-submit">
                {loading ? "Signing in…" : "Continue"}
                {!loading && <ArrowRight size={15} />}
              </Button>
            </form>
          </section>
          {demo && (
            <>
              <div className="login-demo-row">
                <span>Take a look first.</span>
                <button
                  disabled={loading}
                  onClick={() => {
                    setUsername("admin");
                    setPassword("admin123");
                    void signIn("admin", "admin123");
                  }}
                >
                  Explore the demo
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <p className="login-demo-credentials">
                Demo login:{" "}
                <span>
                  Username <code>admin</code>
                </span>
                <span>
                  Password <code>admin123</code>
                </span>
              </p>
            </>
          )}
        </div>
        <a className="login-scroll-cue" href="#about">
          About the project <ArrowDown size={13} />
        </a>
      </div>
      <main id="about" className="login-project">
        <section className="project-intro" aria-labelledby="project-heading">
          <p className="project-label">The project</p>
          <h2 id="project-heading">
            A place for your
            <br />
            <em>medical inventory.</em>
          </h2>
          <p>
            MedInv brings medicine records, stock levels, orders, and patient
            information into one web application. Built for the work behind the
            counter, with the details kept close.
          </p>
        </section>
        <figure className="project-preview">
          <div className="preview-titlebar">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>MedInv / Overview</span>
            <span>Demo workspace</span>
          </div>
          <img
            src="/scenery/workspace.webp"
            width={1160}
            height={800}
            loading="lazy"
            alt="MedInv overview showing inventory quantities, medicine records, and expiry alerts with sample data"
          />
          <figcaption>
            The workspace, with sample data.{" "}
            <a href="#sign-in">
              Try it yourself <ArrowUpRight size={12} />
            </a>
          </figcaption>
        </figure>
        <section
          className="project-workflows"
          aria-label="What MedInv includes"
        >
          <article>
            <span className="workflow-number">01</span>
            <div>
              <Package size={20} strokeWidth={1.5} />
              <h3>Know what’s in stock.</h3>
              <p>
                Keep a medicine catalogue, adjust quantities, and find low-stock
                items. Search the inventory, check expiry dates, or export a
                filtered list as CSV.
              </p>
            </div>
          </article>
          <article>
            <span className="workflow-number">02</span>
            <div>
              <FileText size={20} strokeWidth={1.5} />
              <h3>Keep the records connected.</h3>
              <p>
                Manage patients, prescriptions, orders, and suppliers alongside
                your inventory. Billing and activity records are accessible from
                the same workspace.
              </p>
            </div>
          </article>
          <article>
            <span className="workflow-number">03</span>
            <div>
              <Code2 size={20} strokeWidth={1.5} />
              <h3>Run it. Read it. Make it yours.</h3>
              <p>
                Built with Next.js, React, TypeScript, and MySQL. The source is
                on GitHub, so you can inspect the application, run it locally,
                and contribute improvements.
              </p>
            </div>
          </article>
        </section>
        <section
          className="project-details"
          aria-labelledby="project-details-heading"
        >
          <div>
            <p className="project-label">Under the hood</p>
            <h2 id="project-details-heading">
              Start with a demo.
              <br />
              <em>Explore from there.</em>
            </h2>
            <a
              className="project-source-link"
              href="https://github.com/dheeraj-juvvadi/MedInv"
              target="_blank"
              rel="noreferrer"
            >
              View the source <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="project-notes">
            <details open>
              <summary>What’s in the demo?</summary>
              <p>
                Sample medicines, inventory, patients, and orders. No database
                setup is needed. Edits are shared within the local server
                process and reset when it restarts—don’t use the demo for real
                patient information.
              </p>
            </details>
            <details>
              <summary>Can I use my own database?</summary>
              <p>
                MedInv supports MySQL. The repository includes setup scripts and
                configuration instructions. Review authentication, access
                controls, and deployment settings before using real records.
              </p>
            </details>
            <details>
              <summary>How do I run it locally?</summary>
              <p>
                Clone the repository, install its dependencies, and run{" "}
                <code>npm run preview</code> for the demo. For a configured
                database, follow the local setup instructions in the README.
              </p>
            </details>
          </div>
        </section>
        <section className="project-return">
          <span>Have a look around.</span>
          <a href="#sign-in">
            Back to sign in <ArrowRight size={15} />
          </a>
        </section>
      </main>
      <footer className="login-footer">
        <span>MedInv</span>
        <span>Medicines · Inventory · Patients</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </FineGrainPattern>
  );
}
