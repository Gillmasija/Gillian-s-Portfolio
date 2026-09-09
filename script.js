(function () {
    "use strict";

    const ROLE_CHIPS = [
        { label: "How I work", value: "I ship across front-end, data/AI, and instruction" },
        { label: "Web stack", value: "I build with React · Next.js · TypeScript" },
        { label: "Data & AI", value: "I use RAG · embeddings · LangChain · Python" },
        { label: "Reach", value: "I've taught 300+ students · MLSA · TUM Devs" },
    ];

    const STACK_ITEMS = [
        "React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Bootstrap",
        "Django", "REST APIs", "SQL", "Python", "pandas", "scikit-learn", "PyTorch",
        "TensorFlow", "OpenCV", "LangChain", "LlamaIndex", "RAG", "Vector DBs",
        "Jupyter", "Docker", "Git", "Flask", "Tkinter", "Pygame",
    ];

    const LANE_LINKS = {
        frontend: "frontend.html",
        data: "data.html",
        teaching: "teaching.html",
    };

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function projectCardHtml(p, opts = {}) {
        const showLane = opts.showLane && p.lane;
        const laneLink = showLane ? LANE_LINKS[p.lane] : null;
        const outcome = p.outcome
            ? `<span class="font-mono small text-accent d-block mt-2">${escapeHtml(p.outcome)}</span>`
            : "";
        const laneBadge = showLane
            ? `<span class="project-lane-badge font-mono">${escapeHtml(p.lane)}</span>`
            : "";
        const liveBadge = p.liveUrl
            ? `<span class="project-live-badge font-mono">Live Demo ↗</span>`
            : "";

        if (p.liveUrl) {
            return `
                <div class="col-md-6 col-xl-4">
                    <div class="card card-glass project-card p-4 tilt-hover reveal h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <span class="project-lang-badge font-mono">${escapeHtml(p.lang || "Code")}</span>
                                ${laneBadge}
                                ${liveBadge}
                            </div>
                            <h3 class="card-title fw-semibold mb-2">${escapeHtml(p.title)}</h3>
                            <p class="text-secondary small mb-0">${escapeHtml(p.desc)}</p>
                            ${outcome}
                        </div>
                        <div class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-10 align-items-center">
                            <a href="${escapeHtml(p.liveUrl)}" class="btn btn-accent btn-sm font-mono px-3" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>
                            <a href="${escapeHtml(p.href)}" class="btn btn-outline-light btn-sm font-mono px-3" target="_blank" rel="noopener noreferrer">GitHub →</a>
                        </div>
                    </div>
                </div>`;
        }

        return `
            <div class="col-md-6 col-xl-4">
                <a href="${escapeHtml(p.href)}" class="card card-glass project-card text-decoration-none text-body p-4 tilt-hover reveal h-100" target="_blank" rel="noopener noreferrer">
                    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span class="project-lang-badge font-mono">${escapeHtml(p.lang || "Code")}</span>
                        ${laneBadge}
                    </div>
                    <h3 class="card-title fw-semibold mb-2">${escapeHtml(p.title)}</h3>
                    <p class="text-secondary small mb-0">${escapeHtml(p.desc)}</p>
                    ${outcome}
                    <span class="font-mono small text-accent d-block mt-3">open repo →</span>
                </a>
            </div>`;
    }

    function renderProjects(gridId, list, opts) {
        const grid = document.getElementById(gridId);
        if (!grid || !list?.length) return;
        grid.innerHTML = list.map((p) => projectCardHtml(p, opts)).join("");
    }

    function initPageProjects() {
        const catalog = window.PORTFOLIO_PROJECTS;
        if (!catalog) return;

        const page = document.body.dataset.page || "home";

        if (page === "home") {
            renderProjects("projectGrid", catalog.highlights, { showLane: true });
            return;
        }
        if (page === "frontend") {
            renderProjects("projectGrid", catalog.frontend);
            return;
        }
        if (page === "teaching") {
            renderProjects("projectGrid", catalog.teaching);
            return;
        }
        if (page === "data") {
            const data = catalog.data || [];
            renderProjects(
                "dataGenaiGrid",
                data.filter((p) => p.section === "genai")
            );
            renderProjects(
                "dataMlGrid",
                data.filter((p) => p.section === "ml")
            );
            renderProjects(
                "dataAnalyticsGrid",
                data.filter((p) => p.section === "analytics")
            );
        }
    }

    function injectRoleChips() {
        const host = document.getElementById("roleChips");
        if (!host) return;
        host.innerHTML = ROLE_CHIPS.map(
            (c) =>
                `<span class="role-chip"><strong>${escapeHtml(c.label)}</strong> · ${escapeHtml(c.value)}</span>`
        ).join("");
    }

    function injectStackMarquee() {
        const el = document.getElementById("stackMarquee");
        if (!el) return;
        const doubled = [...STACK_ITEMS, ...STACK_ITEMS];
        const spans = doubled.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
        el.innerHTML = `<div class="stack-inner" aria-hidden="true">${spans}</div>`;
    }

    function setupProfileFallback() {
        const img = document.getElementById("profilePhoto");
        const fb = document.getElementById("profileFallback");
        if (!img || !fb) return;
        img.addEventListener("error", function () {
            img.classList.add("d-none");
            fb.classList.remove("d-none");
        });
        if (img.complete && img.naturalWidth === 0) {
            img.classList.add("d-none");
            fb.classList.remove("d-none");
        }
    }

    function setupReveal() {
        const items = document.querySelectorAll(".reveal");
        if (!items.length || !("IntersectionObserver" in window)) {
            items.forEach((el) => el.classList.add("is-visible"));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-visible");
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        items.forEach((el) => io.observe(el));
    }

    function setupSmoothNavClose() {
        document.querySelectorAll('.navbar-collapse a[href^="#"]').forEach((link) => {
            link.addEventListener("click", () => {
                const nav = document.querySelector(".navbar-collapse");
                if (nav && nav.classList.contains("show")) {
                    const bs = window.bootstrap?.Collapse?.getOrCreateInstance(nav);
                    bs?.hide();
                }
            });
        });
    }

    function setYear() {
        const y = document.getElementById("year");
        if (y) y.textContent = String(new Date().getFullYear());
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    injectRoleChips();
    injectStackMarquee();
    initPageProjects();
    setupProfileFallback();
    setupReveal();
    setupSmoothNavClose();
    setYear();
})();
