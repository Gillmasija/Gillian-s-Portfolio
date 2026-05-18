(function () {
    "use strict";

    const ROLE_CHIPS = [
        { label: "How I work", value: "I ship across front-end, data/AI, and instruction" },
        { label: "Web stack", value: "I build with React · Next.js · TypeScript" },
        { label: "Data & AI", value: "I use RAG · embeddings · LangChain · Python" },
        { label: "Reach", value: "I've taught 300+ students · MLSA · TUM Devs" },
    ];

    const STACK_ITEMS = [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML/CSS",
        "Bootstrap",
        "Django",
        "REST APIs",
        "SQL",
        "Python",
        "PyTorch",
        "LangChain",
        "LlamaIndex",
        "RAG",
        "Vector DBs",
        "Docker",
        "Git",
        "MLOps-minded",
        "Accessibility",
        "Performance",
    ];

    const PROJECTS = [
        {
            title: "Multimodal RAG — Enterprise document analysis",
            desc: "I built this to show how I think about retrieval, documents, and multimodal enterprise analysis.",
            href: "https://github.com/Gillmasija/Multimodal_RAG_Enterprise_Document_Analysis",
        },
        {
            title: "Edudash / educational dashboards",
            desc: "I explore product-style dashboards and full-stack flows where learning products need clear UI.",
            href: "https://github.com/Gillmasija/EdudashPlatform",
        },
        {
            title: "Image recognition",
            desc: "I keep this around as my ML/CV baseline when I talk through applied data-science problems.",
            href: "https://github.com/Gillmasija/Image-recognition",
        },
        {
            title: "django",
            desc: "I practice Django patterns here because I use them in class, at bootcamp, and in product work.",
            href: "https://github.com/Gillmasija/django",
        },
        {
            title: "NCS & additional builds",
            desc: "I park extra application code and experiments in repos like this — I'm tightening READMEs as I go.",
            href: "https://github.com/Gillmasija/NCS",
        },
    ];

    function injectRoleChips() {
        const host = document.getElementById("roleChips");
        if (!host) return;
        host.innerHTML = ROLE_CHIPS.map(
            (c) =>
                `<span class="role-chip"><strong>${escapeHtml(c.label)}</strong> · ${escapeHtml(
                    c.value
                )}</span>`
        ).join("");
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function injectStackMarquee() {
        const el = document.getElementById("stackMarquee");
        if (!el) return;
        const doubled = [...STACK_ITEMS, ...STACK_ITEMS];
        const spans = doubled.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
        el.innerHTML = `<div class="stack-inner" aria-hidden="true">${spans}</div>`;
    }

    function injectProjects() {
        const grid = document.getElementById("projectGrid");
        if (!grid) return;
        grid.innerHTML = PROJECTS.map(
            (p) => `
            <div class="col-md-6 col-xl-4">
                <a href="${escapeHtml(p.href)}" class="card card-glass project-card text-decoration-none text-body p-4 tilt-hover reveal" target="_blank" rel="noopener noreferrer">
                    <h3 class="card-title fw-semibold mb-2">${escapeHtml(p.title)}</h3>
                    <p class="text-secondary small mb-3">${escapeHtml(p.desc)}</p>
                    <span class="font-mono small text-accent">open my repo →</span>
                </a>
            </div>`
        ).join("");
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
    injectProjects();
    setupProfileFallback();
    setupReveal();
    setupSmoothNavClose();
    setYear();
})();
