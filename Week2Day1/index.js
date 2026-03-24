// index.js

// Select elements
const markAll = document.querySelector(".mark-all-btn");
const unreadCount = document.querySelector(".unread-count");

// Function to update unread counter dynamically
function updateUnreadCount() {
    const unreadMessages = document.querySelectorAll(".unread-bg");
    unreadCount.innerText = unreadMessages.length;
}

// Initial count on page load
updateUnreadCount();

// Mark all notifications as read
markAll.addEventListener('click', () => {
    const unreadMessages = document.querySelectorAll(".unread-bg");
    unreadMessages.forEach(message => message.classList.remove("unread-bg"));

    const redDots = document.querySelectorAll(".dot");
    redDots.forEach(dot => dot.style.display = "none");

    updateUnreadCount();
});

// Individual notification click
document.querySelectorAll(".notification-card").forEach((message) => {
    message.addEventListener('click', () => {
        if (message.classList.contains("unread-bg")) {
            message.classList.remove("unread-bg");

            const dot = message.querySelector('.dot');
            if(dot) dot.style.display = "none";

            updateUnreadCount();
        }
    });
});

// Private message toggle
document.querySelectorAll('.private-message').forEach(msg => {
    msg.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent marking the whole card as read
        msg.classList.toggle('bg-blue-100');
    });
});