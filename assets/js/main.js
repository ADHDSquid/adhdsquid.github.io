const bar = document.createElement("div");
bar.className = "scroll-progress";
document.body.appendChild(bar);

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${pct}%`;
    navbar?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

function splitChars(el) {
    const tmp = document.createElement("div");
    tmp.innerHTML = el.innerHTML;
    el.innerHTML = "";

    tmp.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split(/(\s+)/).forEach((word) => {
                if (!word.trim()) { el.appendChild(document.createTextNode(word)); return; }
                const ws = document.createElement("span");
                ws.className = "word";
                [...word].forEach((ch) => {
                    const s = document.createElement("span");
                    s.className = "char";
                    s.textContent = ch;
                    ws.appendChild(s);
                });
                el.appendChild(ws);
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const ws = document.createElement("span");
            ws.className = "word";
            ws.style.cssText = node.style.cssText;
            [...node.textContent].forEach((ch) => {
                const s = document.createElement("span");
                s.className = "char";
                s.textContent = ch;
                s.style.color = node.style.color || "";
                ws.appendChild(s);
            });
            el.appendChild(ws);
        }
    });
}

const heroH1 = document.querySelector(".hero h1");
if (heroH1) {
    splitChars(heroH1);
    heroH1.querySelectorAll(".char").forEach((ch, i) => {
        ch.style.transitionDelay = `${0.04 + i * 0.032}s`;
    });
    requestAnimationFrame(() => setTimeout(() => {
        heroH1.classList.add("revealed");
        document.querySelector(".hero")?.classList.add("revealed");
    }, 80));
}

new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add("in-view");
            e.target.querySelectorAll(".license-section").forEach((sec, i) => {
                sec.style.transitionDelay = `${i * 0.06}s`;
                sec.style.opacity = "0";
                sec.style.transform = "translateY(14px)";
                sec.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                requestAnimationFrame(() => setTimeout(() => {
                    sec.style.opacity = "1";
                    sec.style.transform = "none";
                }, i * 60));
            });
        }
    });
}, { threshold: 0.1 }).observe.bind(
    new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("in-view");
        });
    }, { threshold: 0.1 })
);

const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll(".section, .license-wrap, .license-text").forEach((el) => obs.observe(el));

document.querySelectorAll(".links-grid a").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25;
        el.style.transform = `translateY(-2px) translate(${dx}px,${dy}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

document.querySelectorAll("nav a").forEach((a) => {
    if (a.getAttribute("href") === window.location.pathname ||
        (window.location.pathname === "/" && a.getAttribute("href") === "/")) {
        a.classList.add("active");
    }
});