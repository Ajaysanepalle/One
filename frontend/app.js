const API_BASE = "http://localhost:8000/api";

let currentAdminToken = localStorage.getItem("adminToken");
let allJobs = [];
let allYears = [];
let allLocations = [];

// ============= MODAL MANAGEMENT =============
const adminModal = document.getElementById("adminModal");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const jobModal = document.getElementById("jobModal");

// Modal open/close handlers
document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", (e) => {
        e.target.closest(".modal").style.display = "none";
    });
});

window.addEventListener("click", (e) => {
    if (e.target === adminModal) adminModal.style.display = "none";
    if (e.target === adminDashboard) adminDashboard.style.display = "none";
    if (e.target === jobModal) jobModal.style.display = "none";
});

adminLoginBtn.addEventListener("click", () => {
    if (currentAdminToken) {
        adminDashboard.style.display = "block";
        loadAdminDashboard();
    } else {
        adminModal.style.display = "block";
    }
});

// ============= ADMIN LOGIN =============
document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    
    try {
        const response = await fetch(`${API_BASE}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentAdminToken = data.access_token;
            localStorage.setItem("adminToken", currentAdminToken);
            adminModal.style.display = "none";
            adminLoginBtn.textContent = "Admin Panel";
            adminDashboard.style.display = "block";
            loadAdminDashboard();
            showAlert("Login successful!", "success");
        } else {
            showAlert("Invalid credentials", "error");
        }
    } catch (error) {
        showAlert("Login failed: " + error.message, "error");
    }
});

// ============= ADMIN LOGOUT =============
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    currentAdminToken = null;
    adminDashboard.style.display = "none";
    adminLoginBtn.textContent = "Admin Login";
    showAlert("Logged out successfully", "success");
    loadJobs();
});

// ============= ADMIN TAB MANAGEMENT =============
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("logout-btn")) return;
        
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
        
        if (tabId === "manage-jobs") {
            loadAdminJobs();
        } else if (tabId === "stats") {
            loadStats();
        }
    });
});

// ============= JOB FORM SUBMISSION =============
document.getElementById("jobForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!currentAdminToken) {
        showAlert("Please login first", "error");
        return;
    }
    
    const jobData = {
        job_name: document.getElementById("jobName").value,
        company: document.getElementById("company").value,
        job_description: document.getElementById("jobDescription").value,
        eligible_years: document.getElementById("eligibleYears").value,
        qualification: document.getElementById("qualification").value,
        link: document.getElementById("link").value,
        location: document.getElementById("location").value,
        last_date: document.getElementById("lastDate").value
    };
    
    try {
        const response = await fetch(`${API_BASE}/jobs?token=${currentAdminToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData)
        });
        
        if (response.ok) {
            document.getElementById("jobForm").reset();
            showAlert("Job posted successfully!", "success");
            loadJobs();
            loadFilters();
        } else {
            showAlert("Failed to post job", "error");
        }
    } catch (error) {
        showAlert("Error: " + error.message, "error");
    }
});

// ============= LOAD ADMIN JOBS =============
async function loadAdminJobs() {
    if (!currentAdminToken) return;
    
    try {
        const response = await fetch(`${API_BASE}/jobs?token=${currentAdminToken}`);
        const jobs = await response.json();
        
        const adminJobsList = document.getElementById("adminJobsList");
        
        if (jobs.length === 0) {
            adminJobsList.innerHTML = '<div class="empty-state"><i class="fas fa-briefcase"></i><p>No jobs posted yet</p></div>';
            return;
        }
        
        adminJobsList.innerHTML = jobs.map(job => `
            <div class="admin-job-item">
                <h4>${job.job_name}</h4>
                <p><strong>${job.company}</strong> | ${job.location}</p>
                <p style="color: #e74c3c; font-weight: bold;">Last date: ${job.last_date}</p>
                <div class="admin-job-actions">
                    <button class="btn btn-primary" onclick="editJob(${job.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteJob(${job.id})">Delete</button>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error loading admin jobs:", error);
    }
}

// ============= DELETE JOB =============
async function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
        const response = await fetch(`${API_BASE}/jobs/${jobId}?token=${currentAdminToken}`, {
            method: "DELETE"
        });
        
        if (response.ok) {
            showAlert("Job deleted successfully", "success");
            loadAdminJobs();
            loadJobs();
        }
    } catch (error) {
        showAlert("Error deleting job: " + error.message, "error");
    }
}

// ============= LOAD STATISTICS =============
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const stats = await response.json();
        
        document.getElementById("totalVisits").textContent = stats.total_visits;
        document.getElementById("uniqueVisitors").textContent = stats.unique_visitors;
        document.getElementById("totalJobs").textContent = stats.total_jobs;
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// ============= LOAD ADMIN DASHBOARD =============
function loadAdminDashboard() {
    if (currentAdminToken) {
        document.querySelector(".tab-btn.active").click();
    }
}

// ============= LOAD ALL JOBS =============
async function loadJobs() {
    try {
        const response = await fetch(`${API_BASE}/jobs`);
        allJobs = await response.json();
        displayJobs(allJobs);
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// ============= DISPLAY JOBS =============
function displayJobs(jobs) {
    const jobsList = document.getElementById("jobsList");
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No jobs found</p></div>';
        return;
    }
    
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card" onclick="viewJobDetails(${job.id})">
            <h3>${job.job_name}</h3>
            <p class="job-company"><i class="fas fa-building"></i> ${job.company}</p>
            <div class="job-meta">
                <div class="job-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${job.eligible_years}</span>
                </div>
            </div>
            <p class="job-description">${job.job_description}</p>
            <div class="job-footer">
                <span class="last-date"><i class="fas fa-calendar"></i> ${job.last_date}</span>
                <button class="btn btn-primary" onclick="event.stopPropagation(); openJobLink('${job.link}')">
                    Apply Now
                </button>
            </div>
        </div>
    `).join("");
}

// ============= VIEW JOB DETAILS =============
function viewJobDetails(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const jobDetails = document.getElementById("jobDetails");
    jobDetails.innerHTML = `
        <div class="job-details-content">
            <div class="job-details-header">
                <h2>${job.job_name}</h2>
                <p class="job-company"><i class="fas fa-building"></i> ${job.company}</p>
            </div>
            <div class="job-details-body">
                <div class="detail-row">
                    <strong>Location:</strong>
                    <p>${job.location}</p>
                </div>
                <div class="detail-row">
                    <strong>Experience:</strong>
                    <p>${job.eligible_years}</p>
                </div>
                <div class="detail-row">
                    <strong>Qualification:</strong>
                    <p>${job.qualification}</p>
                </div>
                <div class="detail-row">
                    <strong>Last Date:</strong>
                    <p class="last-date">${job.last_date}</p>
                </div>
                <div class="detail-row">
                    <strong>Description:</strong>
                    <p>${job.job_description}</p>
                </div>
                <div class="detail-row">
                    <strong>Apply:</strong>
                    <p><a href="${job.link}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Click here to apply</a></p>
                </div>
                <button class="btn btn-primary" onclick="openJobLink('${job.link}'); window.close()">
                    <i class="fas fa-external-link-alt"></i> Open Application
                </button>
            </div>
        </div>
    `;
    
    jobModal.style.display = "block";
}

function openJobLink(link) {
    window.open(link, "_blank");
}

// ============= LOAD FILTERS =============
async function loadFilters() {
    try {
        const yearsResponse = await fetch(`${API_BASE}/years`);
        allYears = await yearsResponse.json();
        
        const locationsResponse = await fetch(`${API_BASE}/locations`);
        allLocations = await locationsResponse.json();
        
        // Update years filter
        const yearsFilter = document.getElementById("yearsFilter");
        yearsFilter.innerHTML = '<option value="">All Years</option>' + 
            allYears.map(year => `<option value="${year}">${year}</option>`).join("");
        
        // Update locations filter
        const locationFilter = document.getElementById("locationFilter");
        locationFilter.innerHTML = '<option value="">All Locations</option>' + 
            allLocations.map(loc => `<option value="${loc}">${loc}</option>`).join("");
        
        // Create year tabs
        const yearsTabsContainer = document.getElementById("yearsTabsContainer");
        yearsTabsContainer.innerHTML = allYears.map(year => 
            `<button class="job-tab-btn" data-tab="years-${year.replace(/\s+/g, '-')}">${year}</button>`
        ).join("");
        
        document.querySelectorAll(".job-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".job-tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const tabName = btn.getAttribute("data-tab");
                if (tabName === "all-jobs") {
                    displayJobs(allJobs);
                } else {
                    const year = btn.textContent;
                    const filtered = allJobs.filter(job => job.eligible_years.includes(year));
                    displayJobs(filtered);
                }
            });
        });
    } catch (error) {
        console.error("Error loading filters:", error);
    }
}

// ============= SEARCH FUNCTIONALITY =============
document.getElementById("searchBtn").addEventListener("click", performSearch);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
});

async function performSearch() {
    const query = document.getElementById("searchInput").value;
    const years = document.getElementById("yearsFilter").value;
    const location = document.getElementById("locationFilter").value;
    
    try {
        let url = `${API_BASE}/search?`;
        if (query) url += `q=${encodeURIComponent(query)}&`;
        if (years) url += `years=${encodeURIComponent(years)}&`;
        if (location) url += `location=${encodeURIComponent(location)}&`;
        
        const response = await fetch(url);
        const results = await response.json();
        displayJobs(results);
        
        // Update tab highlight
        document.querySelectorAll(".job-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelector('[data-tab="all-jobs"]').classList.add("active");
    } catch (error) {
        console.error("Error searching:", error);
    }
}

// ============= FILTER CHANGE LISTENERS =============
document.getElementById("yearsFilter").addEventListener("change", performSearch);
document.getElementById("locationFilter").addEventListener("change", performSearch);

document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("yearsFilter").value = "";
    document.getElementById("locationFilter").value = "";
    document.querySelectorAll(".job-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-tab="all-jobs"]').classList.add("active");
    loadJobs();
});

// ============= ALERT HELPER =============
function showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
    // Check if admin is already logged in
    if (currentAdminToken) {
        adminLoginBtn.textContent = "Admin Panel";
    }
    
    loadJobs();
    loadFilters();
});
