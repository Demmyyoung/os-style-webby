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

function openApp(appName) {
  const windowId = appName + "-app";
  const appWindow = document.getElementById(windowId);

  if (appWindow) {
    appWindow.classList.remove("hidden");
    bringToFront(appWindow);
  }
}

function closeApp(windowId) {
  const appWindow = document.getElementById(windowId);
  if (appWindow) {
    appWindow.classList.add("hidden");
    appWindow.classList.remove("maximized");
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
  // Optional: open cart when added
  // openApp('cart');
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
            <span>$${item.price} <span style="cursor:pointer; color:red; margin-left:8px;" onclick="removeFromCart(${index})">×</span></span>
        `;
    cartContainer.appendChild(div);
  });

  totalElement.textContent = "$" + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Draggable Logic - Snappy
const windows = document.querySelectorAll(".window");
windows.forEach((win) => {
  const header = win.querySelector(".window-header");

  win.addEventListener("mousedown", () => {
    bringToFront(win);
  });

  if (header) {
    header.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("dot")) return;
      if (win.classList.contains("maximized")) return;

      let isDragging = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startLeft = win.offsetLeft;
      let startTop = win.offsetTop;

      bringToFront(win);

      function onMouseMove(e) {
        if (!isDragging) return;
        // Raw styling updates for snappiness - no requestAnimationFrame for simplicity unless needed
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        win.style.left = `${startLeft + dx}px`;
        win.style.top = `${startTop + dy}px`;
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

setInterval(updateClock, 1000);
updateClock();
// Expose functions globally for HTML access
window.openApp = openApp;
window.closeApp = closeApp;
window.toggleMaximize = toggleMaximize;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
