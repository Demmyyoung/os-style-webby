// Clock Logic
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const timeString = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  const clockElement = document.getElementById("clock");
  if (clockElement) {
    clockElement.textContent = timeString;
  }
}

let highestZ = 100;

function bringToFront(element) {
  highestZ++;
  element.style.zIndex = highestZ;
}

// Menu Bar Logic
function setMenuAppName(name) {
  const appNameEl = document.querySelector(".menu-left .menu-item.active");
  if (appNameEl) {
    appNameEl.textContent = name;
  }
}

function openApp(appName) {
  const windowId = appName + "-app";
  const appWindow = document.getElementById(windowId);

  if (appWindow) {
    appWindow.classList.remove("hidden");
    bringToFront(appWindow);
    // Update Menu Bar Text
    const title = appName.charAt(0).toUpperCase() + appName.slice(1);
    setMenuAppName(title);
  }
}

function closeApp(windowId) {
  const appWindow = document.getElementById(windowId);
  if (appWindow) {
    appWindow.classList.add("hidden");
    appWindow.classList.remove("maximized");
    // Reset to Finder if closing?
    // Simple logic: if closing current active, go back to Finder.
    // For now, let's just set it to Finder to be safe or check other windows.
    setMenuAppName("Finder");
  }
}

function toggleMaximize(windowId) {
  const appWindow = document.getElementById(windowId);
  if (appWindow) {
    appWindow.classList.toggle("maximized");
    bringToFront(appWindow);
  }
}

// Cart Logic
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
  // openApp('cart');
  // Flash cart icon or something?
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!cartContainer || !totalElement) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<div class="empty-state">Cart is empty</div>';
    totalElement.textContent = "$0";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
             <span>${item.name}</span>
            <div style="display:flex; align-items:center;">
                <span>$${item.price}</span>
                <span class="remove-btn" onclick="removeFromCart(${index})">×</span>
            </div>
        `;
    cartContainer.appendChild(div);
  });

  totalElement.textContent = "$" + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Draggable Logic
const windows = document.querySelectorAll(".window");
windows.forEach((win) => {
  const header = win.querySelector(".window-header");

  // Activate on click
  win.addEventListener("mousedown", () => {
    bringToFront(win);
    // Also update menu name when clicking window
    const title = win.querySelector(".window-title").textContent;
    setMenuAppName(title);
  });

  if (header) {
    header.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("dot") ||
        e.target.closest(".window-controls")
      )
        return;
      if (win.classList.contains("maximized")) return;

      let isDragging = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startLeft = win.offsetLeft;
      let startTop = win.offsetTop;

      bringToFront(win);

      function onMouseMove(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // Constraints
        const minLeft = -win.offsetWidth + 50;
        const maxLeft = window.innerWidth - 50;
        const minTop = 32; // Menu height
        const maxTop = window.innerHeight - 50;

        newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
        newTop = Math.max(minTop, Math.min(newTop, maxTop));

        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }
});

// Reset to Finder when clicking desktop
document.querySelector(".desktop-area")?.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("desktop-area")) {
    setMenuAppName("Finder");
  }
});

setInterval(updateClock, 1000);
updateClock();

window.openApp = openApp;
window.closeApp = closeApp;
window.toggleMaximize = toggleMaximize;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
