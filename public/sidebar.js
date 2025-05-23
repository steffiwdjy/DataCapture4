document.addEventListener("DOMContentLoaded", () => {
  const sidebar = `
    <div class="sidebar">
      <h2>Menu</h2>
      <p><strong>User:</strong> ${localStorage.getItem("email") || "Guest"}</p>
      <ul>
        <li><a href="/tenant-input.html">Input Data Penyewa</a></li>
        <li><a href="/tenant-list.html">Lihat/Edit Data Penyewa</a></li>
        <li><a href="/login.html" onclick="localStorage.clear()">Logout</a></li>
      </ul>
    </div>
  `;
  document.getElementById("sidebar-container").innerHTML = sidebar;
});
