// API Base URL
const API_URL = "http://localhost:3000/api";

// REGISTER USER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        window.location.href = "index.html";
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Unable to connect to server. Please make sure the backend is running.");
    }
  });
}

// LOGIN USER
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    };

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        
        alert(result.message);
        window.location.href = "home.html";
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Unable to connect to server. Please make sure the backend is running.");
    }
  });
}

// CHECK IF USER IS LOGGED IN (for home.html)
window.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;
  
  // Protect home page
  if (currentPage.includes("home.html")) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !user) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }
    
    // Display user name
    const userNameElement = document.getElementById("userName");
    if (userNameElement && user.name) {
      userNameElement.textContent = `Welcome, ${user.name}`;
    }
  }
});

// LOGOUT FUNCTIONALITY
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  });
}
