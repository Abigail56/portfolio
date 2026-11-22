import Head from "next/head";
import Link from "next/link";

export default function CvPage() {
  return (
    <>
      <Head>
        <title>Chinecherem Chukwu | CV</title>
        <meta name="description" content="Curriculum Vitae for Chukwu Chinecherem, Full-Stack Software Engineer." />
      </Head>

      <style jsx global>{`
        :root {
          --cv-text: var(--fg);
          --cv-muted: var(--muted);
          --cv-accent: var(--accent);
          --cv-line: var(--line);
          --cv-bg: var(--surface);
        }

        html, body {
          background: var(--cv-bg);
          color: var(--cv-text);
          font-family: var(--font-body), Arial, sans-serif;
        }

        .cv-page-shell {
          background: var(--bg);
          color: var(--fg);
          padding: 18px 0 40px;
          min-height: 100vh;
        }

        .cv-topbar {
          max-width: 210mm;
          margin: 0 auto 14px;
          display: flex;
          justify-content: flex-end;
        }

        .cv-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1.1rem;
          border-radius: 0.5rem;
          background: var(--accent-solid);
          color: var(--on-accent);
          font-family: var(--font-body), Arial, sans-serif;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.02em;
          box-shadow: var(--shadow-sm);
          transition: background 180ms ease;
        }

        .cv-download:hover {
          background: var(--accent-solid-hover);
        }

        .cv-page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: var(--surface);
          padding: 16mm 16mm 12mm 16mm;
          color: var(--cv-text);
          box-sizing: border-box;
          page-break-after: always;
          border: 1px solid var(--line);
          border-radius: 0.75rem;
          box-shadow: var(--shadow-lg);
        }

        .cv-page:last-child {
          page-break-after: auto;
        }

        .cv-page-inner {
          display: flex;
          flex-direction: column;
          min-height: calc(297mm - 32mm);
        }

        .cv-header {
          margin-bottom: 8px;
        }

        .cv-name {
          margin: 0;
          font-family: var(--font-heading), Arial, sans-serif;
          font-weight: 700;
          font-size: 26pt;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--cv-text);
        }

        .cv-role {
          margin: 0.2rem 0 0.3rem;
          font-size: 10pt;
          line-height: 1.45;
          color: var(--cv-text);
          font-weight: 500;
        }

        .cv-contact {
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0 0.75rem;
          font-size: 9.2pt;
          line-height: 1.45;
          color: var(--cv-muted);
        }

        .cv-contact a,
        .cv-body a,
        .cv-meta a {
          color: var(--cv-accent);
          text-decoration: underline;
          text-underline-offset: 0.12em;
          text-decoration-thickness: 1px;
        }

        .cv-section {
          margin-top: 8px;
        }

        .cv-section h2 {
          margin: 0 0 4px;
          padding-bottom: 2px;
          border-bottom: 1px solid var(--cv-line);
          font-family: var(--font-heading), Arial, sans-serif;
          font-size: 11pt;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cv-accent);
        }

        .cv-body {
          margin: 0;
          font-size: 10pt;
          line-height: 1.45;
          color: var(--cv-text);
        }

        .cv-body p {
          margin: 2px 0 0;
        }

        .cv-body ul {
          margin: 4px 0 0;
          padding-left: 1.1rem;
        }

        .cv-body li {
          margin: 2px 0;
        }

        .cv-meta {
          margin: 0.35rem 0 0;
          font-size: 10pt;
          line-height: 1.45;
          color: var(--cv-text);
        }

        .cv-project {
          margin-top: 6px;
        }

        .cv-project h3 {
          margin: 0 0 2px;
          font-family: var(--font-heading), Arial, sans-serif;
          font-weight: 700;
          font-size: 10.5pt;
          line-height: 1.35;
          color: var(--cv-accent);
        }

        .cv-project .stack {
          margin: 2px 0 3px;
          color: var(--cv-muted);
          font-size: 9.5pt;
          line-height: 1.45;
        }

        .cv-project-grid {
          display: grid;
          gap: 5px;
        }

        .cv-footer {
          margin-top: auto;
          border-top: 1px solid var(--cv-line);
          padding-top: 8px;
          font-family: var(--font-code), monospace;
          font-size: 7.5pt;
          color: var(--cv-muted);
          display: flex;
          justify-content: center;
          text-align: center;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (max-width: 820px) {
          .cv-page-shell {
            padding: 1rem 0 2.5rem;
          }

          .cv-page {
            width: min(100%, 210mm);
            min-height: auto;
            padding: 1rem;
            border-radius: 0.5rem;
          }

          .cv-topbar {
            padding: 0 0.75rem;
          }
        }

        @media print {
          html, body {
            background: white;
            color: #171310;
          }

          .cv-page-shell {
            background: white;
            padding: 0;
          }

          .cv-topbar,
          .cv-download {
            display: none;
          }

          .cv-page {
            width: 210mm;
            min-height: 297mm;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            background: white;
            color: #171310;
          }

          .cv-section h2,
          .cv-project h3,
          .cv-contact a,
          .cv-body a,
          .cv-meta a {
            color: #b45309;
          }

          .cv-footer,
          .cv-contact,
          .cv-project .stack {
            color: #5c5249;
          }

          .cv-line,
          .cv-footer,
          .cv-section h2 {
            border-color: #e7e0d8;
          }
        }
      `}</style>

      <div className="cv-page-shell">
        <div className="cv-topbar">
          <a className="cv-download" href="/cv/Chinecherem-Chukwu-CV.pdf" download="Chinecherem-Chukwu-CV.pdf">
            Download PDF
          </a>
        </div>

        <article className="cv-page" aria-label="CV page one">
          <div className="cv-page-inner">
            <header className="cv-header">
              <h1 className="cv-name">CHINECHEREM CHUKWU</h1>
              <p className="cv-role">Full-Stack Software Engineer</p>
              <p className="cv-contact">
                <span>Port Harcourt, Nigeria</span>
                <span>|</span>
                <span>chinecheremchukwu15@gmail.com</span>
                <span>|</span>
                <span>+234 9060461720</span>
                <span>|</span>
                <a href="https://linkedin.com/in/necherem-chukwu">linkedin.com/in/necherem-chukwu</a>
                <span>|</span>
                <a href="https://github.com/Abigail56">github.com/Abigail56</a>
              </p>
            </header>

            <section className="cv-section">
              <h2>Summary</h2>
              <div className="cv-body">
                <p>Full-Stack Software Engineer building multi-tenant web platforms with Next.js, TypeScript, FastAPI, and PostgreSQL. Shipped RouteBridge, a live logistics platform connecting merchants, customers, and delivery partners with role-based access control. Former construction project coordinator, so I understand the logistics and operations workflows I build software for.</p>
              </div>
            </section>

            <section className="cv-section">
              <h2>Technical Skills</h2>
              <div className="cv-body">
                <p><strong>Languages:</strong> Python, TypeScript, JavaScript, SQL</p>
                <p><strong>Frontend:</strong> React, Next.js, Tailwind CSS</p>
                <p><strong>Backend:</strong> FastAPI, SQLModel, SQLAlchemy, Pydantic, Alembic</p>
                <p><strong>Data:</strong> PostgreSQL, Redis, Celery</p>
                <p><strong>Security:</strong> JWT, Argon2, RBAC</p>
                <p><strong>Testing and tooling:</strong> Pytest, Ruff, ESLint, Docker, GitHub Actions, Linux</p>
              </div>
            </section>

            <section className="cv-section">
              <h2>Projects</h2>
              <div className="cv-project-grid">
                <div className="cv-project">
                  <h3>RouteBridge Logistics: Multi-Tenant Logistics Platform</h3>
                  <p className="cv-meta"><strong>Live:</strong> <a href="https://routebridge-web.onrender.com">routebridge-web.onrender.com</a></p>
                  <p className="cv-meta"><strong>Stack:</strong> Python, FastAPI, React, Next.js, TypeScript, SQLModel, PostgreSQL, Docker</p>
                  <ul className="cv-body">
                    <li>Built a multi-tenant platform with separate roles for merchants, customers, and delivery partners, enforced through RBAC on API endpoints.</li>
                    <li>Designed a PostgreSQL schema with SQLModel and managed schema changes through Alembic migrations.</li>
                    <li>Containerised the stack with Docker and deployed it to Render.</li>
                    <li>Covered flows with Pytest.</li>
                  </ul>
                </div>

                <div className="cv-project">
                  <h3>FleetPulse: Fleet Management and Vehicle-Tracking SaaS (in development)</h3>
                  <p className="cv-meta"><strong>Stack:</strong> Next.js, React, TypeScript, Python, FastAPI, PostgreSQL, Redis</p>
                  <ul className="cv-body">
                    <li>Building vehicle monitoring and fleet operations features for logistics companies.</li>
                    <li>Modelling vehicles, drivers, and trips in PostgreSQL, with Redis for live location updates.</li>
                  </ul>
                </div>

                <div className="cv-project">
                  <h3>CheapMarket: Grocery Shopping and Delivery Platform (in development)</h3>
                  <p className="cv-meta"><strong>Stack:</strong> Next.js, React, TypeScript, Tailwind CSS, Python, FastAPI, PostgreSQL, Redis, Docker</p>
                  <ul className="cv-body">
                    <li>Building order, payment, and delivery workflows for the Nigerian market, with Redis handling caching and rate limiting.</li>
                    <li>Modelling products, carts, and orders in PostgreSQL with Alembic migrations.</li>
                  </ul>
                </div>

                <div className="cv-project">
                  <p className="cv-body">Additional projects in progress: GhostWork (workflow automation), EchoVault Nexus (knowledge management).</p>
                </div>
              </div>
            </section>

            <footer className="cv-footer">Chinecherem Chukwu | Full-Stack Software Engineer | Page 1 of 2</footer>
          </div>
        </article>

        <article className="cv-page" aria-label="CV page two">
          <div className="cv-page-inner">
            <section className="cv-section">
              <h2>Technical Training</h2>
              <div className="cv-body">
                <p><strong>AfricaPlan Foundation, in partnership with Hordanso:</strong> AfricaPlan Hackathon 2026 — Certificate of Achievement | 14 November 2026</p>
                <ul>
                  <li>Recognised for practical competence in full-stack (front-end and back-end) development, agentic automation, and capstone project execution.</li>
                </ul>
              </div>
            </section>

            <section className="cv-section">
              <h2>Experience</h2>
              <div className="cv-body">
                <p><strong>Astroy Construction Company:</strong> Site Management | Imo State, Nigeria | May 2019 to December 2021</p>
                <ul>
                  <li>Prepared Bills of Quantities and reviewed building designs for projects.</li>
                  <li>Coordinated site activity against project plans and technical documentation, resolving issues with engineers and contractors.</li>
                </ul>

                <p><strong>National Youth Service Corps (NYSC):</strong> Mathematics Teacher and Head of Corps Members | Akwa Ibom, Nigeria | November 2022 to November 2023</p>
                <ul>
                  <li>Taught Mathematics to students.</li>
                  <li>Led corps members as Head, handling scheduling, communication, and administration.</li>
                </ul>
              </div>
            </section>

            <section className="cv-section">
              <h2>Education</h2>
              <div className="cv-body">
                <p><strong>Enugu State University of Science and Technology (ESUT):</strong> Bachelor&apos;s Degree in Building Technology, 2016 to 2021</p>
              </div>
            </section>

            <section className="cv-section">
              <h2>Languages</h2>
              <div className="cv-body">
                <p>English (proficient), Igbo (native)</p>
              </div>
            </section>

            <footer className="cv-footer">Chinecherem Chukwu | Full-Stack Software Engineer | Page 2 of 2</footer>
          </div>
        </article>
      </div>

      <Link href="/cv/Chinecherem-Chukwu-CV.pdf" download="Chinecherem-Chukwu-CV.pdf" className="sr-only">
        Download PDF
      </Link>
    </>
  );
}
