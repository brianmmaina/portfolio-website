const fallbackProjects = [
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

function renderProjects(projects) {
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

async function fetchProjects() {
  const apiBaseUrl = document.body.dataset.apiBaseUrl || "";
  if (!apiBaseUrl) {
    return fallbackProjects;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/projects`);
    if (!response.ok) {
      throw new Error("Could not load projects");
    }

    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      return fallbackProjects;
    }

    return projects.map((project) => ({
      title: project.title,
      description: project.description,
      stack: Array.isArray(project.stack) ? project.stack : [],
      status: project.status || "Live"
    }));
  } catch (error) {
    console.error(error);
    return fallbackProjects;
  }
}

function attachContactHandler() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form || !note) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const apiBaseUrl = document.body.dataset.apiBaseUrl || "";
    if (!apiBaseUrl) {
      note.textContent = "Add your Railway API URL in index.html to enable this form.";
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim()
    };

    note.textContent = "Sending...";

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Could not send message");
      }

      form.reset();
      note.textContent = "Message sent. Thanks for reaching out.";
    } catch (error) {
      console.error(error);
      note.textContent = "Could not send message right now. Please try again.";
    }
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

async function initialize() {
  const projects = await fetchProjects();
  renderProjects(projects);
  attachContactHandler();
  setYear();
}

initialize();
