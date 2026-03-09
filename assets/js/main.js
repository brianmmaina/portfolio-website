const projects = [
  {
    title: "TriLive",
    description:
      "Real-time TriMet bus and rail tracking with FastAPI backend and SwiftUI frontend.",
    stack: ["FastAPI", "SwiftUI", "PostgreSQL"],
    status: "Live"
  },
  {
    title: "Project Slot 2",
    description: "Skeleton slot ready for your next featured build.",
    stack: ["TODO"],
    status: "Coming Soon"
  },
  {
    title: "Project Slot 3",
    description: "Skeleton slot ready for your next featured build.",
    stack: ["TODO"],
    status: "Coming Soon"
  },
  {
    title: "Project Slot 4",
    description: "Skeleton slot ready for your next featured build.",
    stack: ["TODO"],
    status: "Coming Soon"
  }
];

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tag-row">
          ${project.stack.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          <span class="tag">${project.status}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function attachContactPlaceholder() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent =
      "Form capture is planned for Railway + Supabase integration.";
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

renderProjects();
attachContactPlaceholder();
setYear();
