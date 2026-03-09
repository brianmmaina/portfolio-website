const bodyDataset = document.body.dataset;
const apiBaseUrl = bodyDataset.apiBaseUrl || "";
const supabaseUrl = bodyDataset.supabaseUrl || "";
const supabaseAnonKey = bodyDataset.supabaseAnonKey || "";

const authPanel = document.getElementById("auth-panel");
const dashboardPanel = document.getElementById("dashboard-panel");
const authNote = document.getElementById("auth-note");
const projectNote = document.getElementById("project-note");
const projectList = document.getElementById("admin-project-list");
const loginForm = document.getElementById("login-form");
const projectForm = document.getElementById("project-form");
const signoutBtn = document.getElementById("signout-btn");
const resetFormBtn = document.getElementById("reset-form-btn");
const projectIdInput = document.getElementById("project-id");

let supabaseClient = null;
let accessToken = "";

function updateAuthUI(isAuthed) {
  authPanel.classList.toggle("admin-hidden", isAuthed);
  dashboardPanel.classList.toggle("admin-hidden", !isAuthed);
}

function requireSetup() {
  if (!apiBaseUrl || !supabaseUrl || !supabaseAnonKey) {
    authNote.textContent =
      "Set data-api-base-url, data-supabase-url, and data-supabase-anon-key on admin.html.";
    loginForm.querySelector("button").disabled = true;
    return false;
  }
  return true;
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  };
}

function parseProjectForm() {
  const formData = new FormData(projectForm);
  return {
    slug: String(formData.get("slug") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    stack: String(formData.get("stack") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    status: String(formData.get("status") || "Live").trim(),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") || 999),
    repo_url: String(formData.get("repo_url") || "").trim() || null,
    live_url: String(formData.get("live_url") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null
  };
}

function fillProjectForm(project) {
  projectIdInput.value = project.id || "";
  projectForm.slug.value = project.slug || "";
  projectForm.title.value = project.title || "";
  projectForm.description.value = project.description || "";
  projectForm.stack.value = Array.isArray(project.stack) ? project.stack.join(", ") : "";
  projectForm.status.value = project.status || "Live";
  projectForm.sort_order.value = Number.isFinite(project.sort_order)
    ? project.sort_order
    : 999;
  projectForm.repo_url.value = project.repo_url || "";
  projectForm.live_url.value = project.live_url || "";
  projectForm.image_url.value = project.image_url || "";
  projectForm.featured.checked = Boolean(project.featured);
}

function resetProjectForm() {
  projectForm.reset();
  projectIdInput.value = "";
  projectForm.status.value = "Live";
  projectForm.sort_order.value = 100;
  projectForm.featured.checked = true;
}

async function fetchAdminProjects() {
  const response = await fetch(`${apiBaseUrl}/api/projects/admin`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Could not load admin projects");
  }
  return response.json();
}

function renderAdminProjectList(projects) {
  projectList.innerHTML = "";
  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = "admin-project-item";
    li.innerHTML = `
      <div>
        <strong>${project.title}</strong>
        <p>${project.slug} · ${project.featured ? "Featured" : "Hidden"}</p>
      </div>
      <div class="admin-row-actions">
        <button class="btn" data-action="edit" data-id="${project.id}" type="button">Edit</button>
        <button class="btn" data-action="delete" data-id="${project.id}" type="button">Delete</button>
      </div>
    `;
    li.querySelector('[data-action="edit"]').addEventListener("click", () =>
      fillProjectForm(project)
    );
    li.querySelector('[data-action="delete"]').addEventListener("click", () =>
      deleteProject(project.id)
    );
    projectList.appendChild(li);
  });
}

async function refreshAdminProjects() {
  const projects = await fetchAdminProjects();
  renderAdminProjectList(projects);
}

async function deleteProject(projectId) {
  if (!confirm("Delete this project?")) return;
  try {
    const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Could not delete project");
    }
    projectNote.textContent = "Project deleted.";
    await refreshAdminProjects();
    resetProjectForm();
  } catch (error) {
    console.error(error);
    projectNote.textContent = "Delete failed. Check admin permissions and try again.";
  }
}

async function handleLogin(event) {
  event.preventDefault();
  authNote.textContent = "Signing in...";

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    authNote.textContent = "Sign in failed. Check credentials.";
    return;
  }

  accessToken = data.session.access_token;
  updateAuthUI(true);
  authNote.textContent = "";
  await refreshAdminProjects();
}

async function handleSaveProject(event) {
  event.preventDefault();
  const payload = parseProjectForm();
  const projectId = projectIdInput.value;

  projectNote.textContent = "Saving...";

  try {
    const response = await fetch(
      projectId ? `${apiBaseUrl}/api/projects/${projectId}` : `${apiBaseUrl}/api/projects`,
      {
        method: projectId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error("Could not save project");
    }

    projectNote.textContent = projectId ? "Project updated." : "Project created.";
    resetProjectForm();
    await refreshAdminProjects();
  } catch (error) {
    console.error(error);
    projectNote.textContent = "Save failed. Check required fields and admin permissions.";
  }
}

async function handleSignOut() {
  await supabaseClient.auth.signOut();
  accessToken = "";
  updateAuthUI(false);
  projectList.innerHTML = "";
  resetProjectForm();
}

async function initialize() {
  if (!requireSetup()) return;

  supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    accessToken = data.session.access_token;
    updateAuthUI(true);
    await refreshAdminProjects();
  } else {
    updateAuthUI(false);
  }

  loginForm.addEventListener("submit", handleLogin);
  projectForm.addEventListener("submit", handleSaveProject);
  signoutBtn.addEventListener("click", handleSignOut);
  resetFormBtn.addEventListener("click", resetProjectForm);
}

initialize();
