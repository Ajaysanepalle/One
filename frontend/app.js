const API_BASE = "https://one-gy8u.onrender.com/api";

let currentAdminToken = localStorage.getItem("adminToken");
let allJobs = [];
let allYears = [];
let allLocations = [];

// ============= PERFORMANCE OPTIMIZATION =============
const apiCache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
let searchTimeout;

// Debounced search function
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => func(...args), delay);
    };
}

// Cache API responses
async function cachedFetch(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);
    
    if (apiCache.has(cacheKey)) {
        const { data, timestamp } = apiCache.get(cacheKey);
        if (Date.now() - timestamp < CACHE_TIME) {
            return data;
        }
        apiCache.delete(cacheKey);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok && !options.method || options.method === "GET") {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return data;
}

// Show loading spinner
function showLoading(show = true) {
    let loader = document.getElementById("loadingSpinner");
    if (!loader) {
        loader = document.createElement("div");
        loader.id = "loadingSpinner";
        loader.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;"><div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div></div>';
        document.body.appendChild(loader);
        
        const style = document.createElement("style");
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    loader.style.display = show ? "block" : "none";
}

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
    showLoading(true);
    
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
            apiCache.clear(); // Clear cache after login
        } else {
            showAlert("Invalid credentials", "error");
        }
    } catch (error) {
        showAlert("Login failed: " + error.message, "error");
    }
    showLoading(false);
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
    showLoading(true);
    
    if (!currentAdminToken) {
        showAlert("Please login first", "error");
        showLoading(false);
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
            apiCache.clear(); // Clear cache
            loadJobs();
            loadFilters();
        } else {
            showAlert("Failed to post job", "error");
        }
    } catch (error) {
        showAlert("Error: " + error.message, "error");
    } finally {
        showLoading(false);
    }
});

// ============= LOAD ADMIN JOBS =============
async function loadAdminJobs() {
    if (!currentAdminToken) return;
    
    try {
        showLoading(true);
        const jobs = await cachedFetch(`${API_BASE}/jobs?token=${currentAdminToken}`);
        
        const adminJobsList = document.getElementById("adminJobsList");
        
        if (jobs.length === 0) {
            adminJobsList.innerHTML = '<div class="empty-state"><i class="fas fa-briefcase"></i><p>No jobs posted yet</p></div>';
            showLoading(false);
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
        showLoading(false);
    } catch (error) {
        console.error("Error loading admin jobs:", error);
        showLoading(false);
    }
}

// ============= EDIT JOB =============
async function editJob(jobId) {
    if (!currentAdminToken) {
        showAlert("Please login first", "error");
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/jobs/${jobId}?token=${currentAdminToken}`);
        const job = await response.json();
        
        // Populate form with job data
        document.getElementById("jobName").value = job.job_name;
        document.getElementById("company").value = job.company;
        document.getElementById("jobDescription").value = job.job_description;
        document.getElementById("eligibleYears").value = job.eligible_years;
        document.getElementById("qualification").value = job.qualification;
        document.getElementById("link").value = job.link;
        document.getElementById("location").value = job.location;
        document.getElementById("lastDate").value = job.last_date;
        
        // Change form submission to update instead of create
        const jobForm = document.getElementById("jobForm");
        jobForm.onsubmit = async (e) => {
            e.preventDefault();
            
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
                const updateResponse = await fetch(`${API_BASE}/jobs/${jobId}?token=${currentAdminToken}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jobData)
                });
                
                if (updateResponse.ok) {
                    jobForm.reset();
                    jobForm.onsubmit = null; // Reset to default
                    showAlert("Job updated successfully!", "success");
                    apiCache.clear(); // Clear cache
                    loadAdminJobs();
                    loadJobs();
                    loadFilters();
                } else {
                    showAlert("Failed to update job", "error");
                }
            } catch (error) {
                showAlert("Error: " + error.message, "error");
            } finally {
                showLoading(false);
            }
        };
        
        // Switch to add-jobs tab and show form
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        document.querySelector('[data-tab="add-jobs"]').classList.add("active");
        document.getElementById("add-jobs").classList.add("active");
        showLoading(false);
    } catch (error) {
        showAlert("Error loading job: " + error.message, "error");
        showLoading(false);
    }
}

// ============= DELETE JOB =============
async function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/jobs/${jobId}?token=${currentAdminToken}`, {
            method: "DELETE"
        });
        
        if (response.ok) {
            showAlert("Job deleted successfully", "success");
            apiCache.clear(); // Clear cache
            loadAdminJobs();
            loadJobs();
        }
    } catch (error) {
        showAlert("Error deleting job: " + error.message, "error");
    } finally {
        showLoading(false);
    }
}

// ============= LOAD STATISTICS =============
async function loadStats() {
    try {
        showLoading(true);
        const stats = await cachedFetch(`${API_BASE}/stats`);
        
        document.getElementById("totalVisits").textContent = stats.total_visits;
        document.getElementById("uniqueVisitors").textContent = stats.unique_visitors;
        document.getElementById("totalJobs").textContent = stats.total_jobs;
        showLoading(false);
    } catch (error) {
        console.error("Error loading stats:", error);
        showLoading(false);
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
        showLoading(true);
        allJobs = await cachedFetch(`${API_BASE}/jobs`);
        displayJobs(allJobs);
        showLoading(false);
    } catch (error) {
        console.error("Error loading jobs:", error);
        showLoading(false);
    }
}

// ============= DISPLAY JOBS (WITH LAZY LOADING) =============
const JOBS_PER_PAGE = 10;
let currentPage = 1;

function displayJobs(jobs) {
    const jobsList = document.getElementById("jobsList");
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No jobs found</p></div>';
        return;
    }
    
    currentPage = 1;
    const paginatedJobs = jobs.slice(0, JOBS_PER_PAGE);
    
    jobsList.innerHTML = paginatedJobs.map(job => `
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
    
    // Add load more button if there are more jobs
    if (jobs.length > JOBS_PER_PAGE) {
        jobsList.innerHTML += `
            <div style="text-align: center; padding: 20px;">
                <button class="btn btn-secondary" onclick="loadMoreJobs(${jobs.length})">
                    Load More Jobs (${jobs.length - paginatedJobs.length} remaining)
                </button>
            </div>
        `;
    }
}

// Load more jobs on demand
function loadMoreJobs(totalJobs) {
    currentPage++;
    const start = currentPage * JOBS_PER_PAGE - JOBS_PER_PAGE;
    const end = currentPage * JOBS_PER_PAGE;
    const jobsList = document.getElementById("jobsList");
    
    const morePaginatedJobs = allJobs.slice(0, end);
    
    jobsList.innerHTML = morePaginatedJobs.map(job => `
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
    
    if (allJobs.length > end) {
        jobsList.innerHTML += `
            <div style="text-align: center; padding: 20px;">
                <button class="btn btn-secondary" onclick="loadMoreJobs(${totalJobs})">
                    Load More Jobs (${allJobs.length - end} remaining)
                </button>
            </div>
        `;
    }
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
        // Make both requests in parallel
        const [yearsResponse, locationsResponse] = await Promise.all([
            fetch(`${API_BASE}/years`),
            fetch(`${API_BASE}/locations`)
        ]);
        
        allYears = await yearsResponse.json();
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

// Debounce search input
document.getElementById("searchInput").addEventListener("input", debounce(performSearch, 500));

async function performSearch() {
    const query = document.getElementById("searchInput").value;
    const years = document.getElementById("yearsFilter").value;
    const location = document.getElementById("locationFilter").value;
    
    try {
        showLoading(true);
        let url = `${API_BASE}/search?`;
        if (query) url += `q=${encodeURIComponent(query)}&`;
        if (years) url += `years=${encodeURIComponent(years)}&`;
        if (location) url += `location=${encodeURIComponent(location)}&`;
        
        const results = await cachedFetch(url);
        displayJobs(results);
        
        // Update tab highlight
        document.querySelectorAll(".job-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelector('[data-tab="all-jobs"]').classList.add("active");
        showLoading(false);
    } catch (error) {
        console.error("Error searching:", error);
        showLoading(false);
    }
}

// ============= FILTER CHANGE LISTENERS =============
document.getElementById("yearsFilter").addEventListener("change", debounce(performSearch, 300));
document.getElementById("locationFilter").addEventListener("change", debounce(performSearch, 300));

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
