QuizMaster - A Dynamic Quiz Application
QuizMaster is a Single Page Application (SPA) designed to test knowledge across various categories. Built with a focus on modular logic and state management, it provides a seamless experience for users to track progress, compete, and review their learning.

🛠 Technical Architecture
This application utilizes a custom-built Router and State Manager to handle content delivery without page reloads.

Dynamic Rendering: A centralized render() function manages the DOM, ensuring consistent navigation and security.

Authentication Gatekeeper: Protects sensitive views (Profile, Quizzes) by validating user credentials stored in localStorage before permitting navigation.

Stateful Engine: A custom quiz engine that tracks user performance, timers, and progress in real-time, providing an instant feedback loop for incorrect answers.

Responsive Design: Built with Tailwind CSS, ensuring the UI adapts from mobile devices to desktop monitors.


Shutterstock
Explore
🚀 Key Functionalities
Dynamic Quiz Generation: Questions are mapped to UI components programmatically, allowing for infinite scalability in quiz length and variety.

Persistent Storage: User sessions and progress are maintained via localStorage, allowing for a seamless "logged-in" experience across browser refreshes.

Review Mechanism: Users can analyze their performance by filtering their answer history against correct data sets after completing a quiz.

📂 Project Structure
index.js: The central "brain" containing the state, the render function (gatekeeper), and all quiz business logic.
data: Structured as nested JSON-like objects, allowing easy expansion for new subjects (Science, History, Math, etc.).

📝 Future Roadmap
Leaderboard Integration: Transitioning from local storage to a persistent database to show global rankings.

Social Features: Adding the ability to challenge friends to specific quiz IDs.

Enhanced Reporting: Providing detailed analytics on strength and weakness trends over time.