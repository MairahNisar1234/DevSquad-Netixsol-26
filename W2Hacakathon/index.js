const root = document.getElementById('root'); //connect javascript with HTML
let currentQuiz = null;
let currentIdx = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 30;
let userAnswers = [];
/* Logic for quiz: 
1. Create Array with values
2. Sub array to store the questions with answers
3. 5 quizes are stored in allQuizzes Array
4. Featured quizes are stored in separate array */ 
const allQuizzes = [
{
id: 1,
title: "General Knowledge",
category: "GK",
description:"Test your overall knowledge with a mix of questions.",
image:"assets/im3.JPG",
questions: [
{ question: "What is the capital of France?", options: ["Paris","London","Rome","Berlin"], answer: "Paris" },
{ question: "How many continents are there?", options: ["5","6","7","8"], answer: "7" },
{ question: "Which ocean is the largest?", options: ["Atlantic","Indian","Pacific","Arctic"], answer: "Pacific" },
{ question: "What is the tallest mountain?", options: ["K2","Everest","Kilimanjaro","Denali"], answer: "Everest" },
{ question: "Which country invented pizza?", options: ["France","Italy","USA","Spain"], answer: "Italy" },
{ question: "Which language has the most speakers?", options: ["English","Spanish","Mandarin","Hindi"], answer: "Mandarin" },
{ question: "What currency is used in Japan?", options: ["Won","Yen","Dollar","Peso"], answer: "Yen" },
{ question: "What gas do humans breathe in?", options: ["Carbon Dioxide","Oxygen","Nitrogen","Hydrogen"], answer: "Oxygen" },
{ question: "Which animal is known as king of jungle?", options: ["Tiger","Lion","Elephant","Leopard"], answer: "Lion" },
{ question: "Which planet do we live on?", options: ["Mars","Venus","Earth","Jupiter"], answer: "Earth" }
]
},

{
id: 2,
title: "Science",
image:"assets/im4.JPG",
category: "Science",
description:"Explore the wonders of science from biology to physics.",
questions: [
{ question: "What planet is known as the Red Planet?", options: ["Mars","Venus","Jupiter","Mercury"], answer: "Mars" },
{ question: "What gas do plants absorb?", options: ["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"], answer: "Carbon Dioxide" },
{ question: "What is H2O?", options: ["Salt","Water","Hydrogen","Oxygen"], answer: "Water" },
{ question: "What force pulls objects toward Earth?", options: ["Magnetism","Gravity","Electricity","Friction"], answer: "Gravity" },
{ question: "What organ pumps blood?", options: ["Lungs","Heart","Brain","Liver"], answer: "Heart" },
{ question: "What star gives Earth light?", options: ["Moon","Sun","Mars","Venus"], answer: "Sun" },
{ question: "What is the center of an atom called?", options: ["Electron","Proton","Nucleus","Neutron"], answer: "Nucleus" },
{ question: "Which vitamin comes from sunlight?", options: ["Vitamin A","Vitamin B","Vitamin C","Vitamin D"], answer: "Vitamin D" },
{ question: "What gas protects Earth from UV rays?", options: ["Ozone","Oxygen","Carbon","Helium"], answer: "Ozone" },
{ question: "What part of the body controls thinking?", options: ["Heart","Brain","Liver","Kidney"], answer: "Brain" }
]
},

{
id: 3,
title: "History",
category: "History",
image:"assets/im6.jpg",
description:"Journey through time and learn about historical events",
questions: [
{ question: "Who was the first President of the USA?", options: ["George Washington","Lincoln","Jefferson","Adams"], answer: "George Washington" },
{ question: "World War II ended in?", options: ["1943","1945","1950","1939"], answer: "1945" },
{ question: "Who discovered America?", options: ["Columbus","Magellan","Cook","Drake"], answer: "Columbus" },
{ question: "The pyramids were built in?", options: ["Rome","Egypt","Greece","China"], answer: "Egypt" },
{ question: "Who was the Roman emperor?", options: ["Julius Caesar","Napoleon","Alexander","Cleopatra"], answer: "Julius Caesar" },
{ question: "The Great Wall is in?", options: ["Japan","India","China","Korea"], answer: "China" },
{ question: "Who was the first man on the Moon?", options: ["Buzz Aldrin","Neil Armstrong","Yuri Gagarin","Collins"], answer: "Neil Armstrong" },
{ question: "The Cold War was between?", options: ["USA & USSR","China & Japan","India & Pakistan","France & Germany"], answer: "USA & USSR" },
{ question: "Who was known as Iron Lady?", options: ["Margaret Thatcher","Queen Elizabeth","Indira Gandhi","Angela Merkel"], answer: "Margaret Thatcher" },
{ question: "Which ship sank in 1912?", options: ["Titanic","Lusitania","Queen Mary","Olympic"], answer: "Titanic" }
]
},

{
id: 4,
title: "Literature",
image:'assets/im5.jpg',
category: "Literature",
description:"Discover the world of books and authors",
questions: [
{ question: "Who wrote Hamlet?", options: ["Shakespeare","Dickens","Austen","Hemingway"], answer: "Shakespeare" },
{ question: "Who wrote 'Pride and Prejudice'?", options: ["Jane Austen","Charlotte Bronte","Virginia Woolf","Emily Bronte"], answer: "Jane Austen" },
{ question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare","Milton","Shelley","Byron"], answer: "Shakespeare" },
{ question: "Who wrote '1984'?", options: ["George Orwell","Huxley","Tolkien","Lewis"], answer: "George Orwell" },
{ question: "Who wrote 'The Odyssey'?", options: ["Homer","Virgil","Sophocles","Plato"], answer: "Homer" },
{ question: "Sherlock Holmes was created by?", options: ["Arthur Conan Doyle","Agatha Christie","Dan Brown","Rowling"], answer: "Arthur Conan Doyle" },
{ question: "Who wrote 'Harry Potter'?", options: ["J.K Rowling","Tolkien","Lewis","Martin"], answer: "J.K Rowling" },
{ question: "Who wrote 'The Great Gatsby'?", options: ["F. Scott Fitzgerald","Hemingway","Faulkner","Steinbeck"], answer: "F. Scott Fitzgerald" },
{ question: "Who wrote 'Macbeth'?", options: ["Shakespeare","Milton","Chaucer","Wordsworth"], answer: "Shakespeare" },
{ question: "Who wrote 'Animal Farm'?", options: ["George Orwell","Huxley","Dickens","Tolstoy"], answer: "George Orwell" }
]
},

{
id: 5,
title: "Mathematics",
category: "Mathematics",
image:"assets/im6.jpg",
description:"Challenge your math skills with various problems",
questions: [
{ question: "What is 5 + 7?", options: ["10","11","12","13"], answer: "12" },
{ question: "What is 9 × 6?", options: ["54","56","48","52"], answer: "54" },
{ question: "What is 15 ÷ 3?", options: ["3","4","5","6"], answer: "5" },
{ question: "What is the square root of 81?", options: ["7","8","9","10"], answer: "9" },
{ question: "What is 10²?", options: ["20","50","100","200"], answer: "100" },
{ question: "What is 7 × 8?", options: ["54","56","64","48"], answer: "56" },
{ question: "What is 100 ÷ 4?", options: ["20","25","30","35"], answer: "25" },
{ question: "What is 12 + 15?", options: ["25","26","27","28"], answer: "27" },
{ question: "What is 9²?", options: ["18","27","81","72"], answer: "81" },
{ question: "What is 50 − 20?", options: ["20","25","30","35"], answer: "30" }
]
}

];
const featuredQuizzes = [
    {
        id: 1,
        title: "The Universe",
        category: "Science",
        description: "Explore the mysteries of the cosmos, from distant stars to black holes.",
        image: "assets/im1.JPG",
        questions: [
            { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
            { question: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Earth"], answer: "Jupiter" },
            { question: "Which galaxy is home to the Earth?", options: ["Andromeda", "Milky Way", "Sombrero", "Triangulum"], answer: "Milky Way" },
            { question: "What is the center of our solar system?", options: ["The Moon", "Earth", "The Sun", "Mars"], answer: "The Sun" },
            { question: "What is a light-year a measure of?", options: ["Time", "Distance", "Speed", "Brightness"], answer: "Distance" },
            { question: "Which force keeps planets in orbit?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], answer: "Gravity" },
            { question: "What are stars primarily made of?", options: ["Oxygen", "Hydrogen", "Carbon", "Iron"], answer: "Hydrogen" },
            { question: "What is a black hole?", options: ["A dead star", "A region of intense gravity", "A dark planet", "A comet"], answer: "A region of intense gravity" },
            { question: "How old is the universe estimated to be?", options: ["1 billion years", "4.5 billion years", "13.8 billion years", "100 billion years"], answer: "13.8 billion years" },
            { question: "Which is the closest star to Earth?", options: ["Proxima Centauri", "Sirius", "The Sun", "Betelgeuse"], answer: "The Sun" }
        ]
    },
    {
        id: 2,
        title: "Ancient Civilizations",
        category: "History",
        description: "Uncover the secrets of lost empires and ancient architectural wonders.",
        image: "assets/im8.png",
        questions: [
            { question: "Which civilization built the Great Pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians" },
            { question: "In which modern-day country was ancient Mesopotamia located?", options: ["Egypt", "Iraq", "Greece", "China"], answer: "Iraq" },
            { question: "Who was the famous queen of ancient Egypt?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"], answer: "Cleopatra" },
            { question: "Which empire was ruled by Julius Caesar?", options: ["Greek", "Roman", "Persian", "Ottoman"], answer: "Roman" },
            { question: "What was the ancient Greek city-state famous for its warriors?", options: ["Athens", "Sparta", "Corinth", "Thebes"], answer: "Sparta" },
            { question: "The Great Wall was built by which civilization?", options: ["Japanese", "Indian", "Chinese", "Mongol"], answer: "Chinese" },
            { question: "Which ancient culture created the Mayan calendar?", options: ["Aztec", "Maya", "Inca", "Olmec"], answer: "Maya" },
            { question: "What writing system did the ancient Sumerians use?", options: ["Hieroglyphics", "Cuneiform", "Alphabet", "Runes"], answer: "Cuneiform" },
            { question: "Which ancient civilization developed democracy?", options: ["Rome", "Athens", "Egypt", "Persia"], answer: "Athens" },
            { question: "What was the capital of the Aztec Empire?", options: ["Cusco", "Tenochtitlan", "Tikal", "Machu Picchu"], answer: "Tenochtitlan" }
        ]
    },
    {
        id: 3,
        title: "Shakespearean Plays",
        category: "Literature",
        description: "Dive into the timeless world of the Bard and his greatest tragedies.",
        image: "assets/im2.JPG",
        questions: [
            { question: "Who is the tragic hero of 'Hamlet'?", options: ["Macbeth", "Othello", "Hamlet", "Lear"], answer: "Hamlet" },
            { question: "Which play features the star-crossed lovers Romeo and Juliet?", options: ["Macbeth", "Romeo and Juliet", "Hamlet", "Twelfth Night"], answer: "Romeo and Juliet" },
            { question: "In which play does a Scottish general become King?", options: ["Hamlet", "Macbeth", "Othello", "Julius Caesar"], answer: "Macbeth" },
            { question: "Who is the villain in 'Othello'?", options: ["Iago", "Cassio", "Brutus", "Tybalt"], answer: "Iago" },
            { question: "Which play involves a shipwreck and mistaken identities?", options: ["Twelfth Night", "Macbeth", "Hamlet", "King Lear"], answer: "Twelfth Night" },
            { question: "What is the name of the forest in 'A Midsummer Night's Dream'?", options: ["Sherwood", "Arden", "Athens Forest", "Windsor"], answer: "Athens Forest" },
            { question: "Which play features the character Puck?", options: ["The Tempest", "A Midsummer Night's Dream", "Hamlet", "Macbeth"], answer: "A Midsummer Night's Dream" },
            { question: "Who kills Julius Caesar?", options: ["Brutus", "Antony", "Cassius", "Both Brutus and Cassius"], answer: "Both Brutus and Cassius" },
            { question: "Which play is about an aging king dividing his kingdom?", options: ["Macbeth", "Hamlet", "King Lear", "Othello"], answer: "King Lear" },
            { question: "What is Shakespeare's famous nickname?", options: ["The Bard", "The Poet", "The Writer", "The Actor"], answer: "The Bard" }
        ]
    }
]


// --- 1. THE NAV COMPONENT ---
/* Logic for navBar:
1. clicking on each item takes to a new page 
2. Quizes page is only accessible after logging in */
const navBar = `
<nav class="flex justify-between items-center px-4 md:px-10 py-4 border-b relative bg-white">
  <!-- Logo -->
  <h3 id="nav-logo" class="text-xl font-bold cursor-pointer" onclick="render('home')">Quiz Master</h3>

  <!-- Hamburger for mobile -->
  <div class="md:hidden flex items-center">
    <button id="mobile-menu-button" class="focus:outline-none">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  </div>

  <!-- Menu Links (hidden on mobile) -->
  <div id="nav-links" class="hidden md:flex items-center gap-8">
    <ul class="flex gap-6 font-medium text-gray-600">
      <li class="cursor-pointer hover:text-blue-600" onclick="render('home')">Home</li>
      <li class="cursor-pointer hover:text-blue-600" onclick="render('quizzes')">Quizzes</li>
      <li class="cursor-pointer hover:text-blue-600">Leaderboard</li>
      <li class="cursor-pointer hover:text-blue-600" onclick="render('profile')">Profile</li>
    </ul>
    <div class="flex items-center gap-4">
      <span class="bg-[#F0F2F5] rounded-full p-3 flex items-center justify-center">
        <img src="assets/bell.png" class="w-5 h-5">
      </span>
      <img src="assets/girl.png" class="w-10 h-10 rounded-full border">
    </div>
  </div>

  <!-- Mobile Menu Dropdown -->
  <div id="mobile-menu" class="absolute top-full left-0 w-full bg-white shadow-md md:hidden hidden">
    <ul class="flex flex-col gap-4 p-4 text-gray-700 font-medium">
      <li class="cursor-pointer hover:text-blue-600" onclick="render('home'); toggleMobileMenu()">Home</li>
      <li class="cursor-pointer hover:text-blue-600" onclick="render('quizzes'); toggleMobileMenu()">Quizzes</li>
      <li class="cursor-pointer hover:text-blue-600" onclick="toggleMobileMenu()">Leaderboard</li>
      <li class="cursor-pointer hover:text-blue-600" onclick="render('profile'); toggleMobileMenu()">Profile</li>
    </ul>
  </div>
</nav>

<main id="app-container"></main>
`;

// --- 2. THE PAGE TEMPLATES ---
/* 1. Home: Landing Page 
2. Account: Sign up page 
3.login: Login Page
4.Profile: Profile page
5.Quizes: Quiz options
6. ActiveQuiz: Quiz 
7. Results: Score page
8. Review: corrections page */
const views = {
    home: `
   <div class="flex flex-col items-center py-6 md:py-10 px-4">
    <section class="w-full max-w-6xl h-[400px] md:h-[500px] rounded-[8px] flex flex-col items-center justify-center text-center bg-cover bg-center overflow-hidden" 
             style="background-image: url('assets/backgrounf.png'); background-color: #333;">
        <div class="bg-black/30 w-full h-full flex flex-col items-center justify-center p-6 md:p-20">
            <h1 class="text-3xl md:text-5xl font-bold text-white mb-3">Welcome to QuizMaster</h1>
            <p class="text-white mb-6 text-sm md:text-base px-4">Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!</p>
            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold" onclick="render('account')">Get Started</button>
        </div>
    </section>
    
    <section class="w-full max-w-6xl mt-10 md:mt-16">
        <h2 class="text-2xl md:text-3xl font-bold text-center md:text-left">Key Features</h2>
        <p class="mt-2 text-center md:text-left">Explore the exciting features that make QuizMaster the ultimate quiz app</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div class="border p-6 rounded-xl">
                <img src="assets/quizzes.png" class="mb-4">
                <h3 class="font-bold">Timed Quizzes</h3>
                <p class="text-sm text-[#61738A]">Challenge yourself with timed quizzes to test your speed and accuracy.</p>
            </div>
            <div class="border p-6 rounded-xl">
                <img src="assets/leader.png" class="mb-4">
                <h3 class="font-bold">Leaderboard</h3>
                <p class="text-sm text-[#61738A]">Compete with friends and other users to see who can achieve the highest scores.</p>
            </div>
            <div class="border p-6 rounded-xl">
                <img src="assets/progress.png" class="mb-4">
                <h3 class="font-bold">Progress Tracking</h3>
                <p class="text-sm text-[#61738A]">Track your progress and see how you improve over time with detailed performance reports.</p>
            </div>
        </div>
    </section>
</div>`,

    account: `
    <h2 class="text-3xl font-bold mb-10 mt-10 text-center">Create your account</h2>
    <div class="max-w-[896px]  mt-10 p-8 bg-white ">
        
        <div class="flex flex-col gap-6">
            <input type="text" id="name" placeholder="Full Name" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <input type="email" id="email" placeholder="Email" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <input type="password" id="password" placeholder="Password" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <input type="password" id="c-password" placeholder="Confirm Password" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <button onclick="saveUser()" class="bg-[#1D71F2] text-white w-full h-[48px] rounded-lg font-semibold mt-2 hover:bg-blue-700 transition">
                Sign Up
            </button>
            <div class="relative w-full">
            <div class="absolute top-0 right-0">
                <p class="text-sm text-gray-500 ml-">Already have an account? <span class="underline cursor-pointer font-bold" onclick="render('login')">Sign in</span></p>
            </div>
            </div>
        </div>
    </div>`,

    login: `
        <h2 class="text-3xl font-bold mb-10 mt-8 text-center">Welcome Back</h2>
        <div class="max-w-[896px]  mt-20 p-12 bg-white ">
        <div class="flex flex-col gap-6 ">
            <input type="email" id="UserEmail" placeholder="Email" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <input type="password" id="UserPassword" placeholder="Password" class="w-full h-[56px] px-4 border rounded-lg bg-gray-50/50">
            <p> Forgot Password? </p>
            <button onclick="userLogin()" class="bg-[#1D71F2] text-white w-full h-[48px] rounded-lg font-semibold mt-2 hover:bg-blue-700 transition">
                Log In
            </button>
            <div class="flex justify-end pr-10">
                <p class="text-sm text-gray-500">Don't have an account? <span onclick=render('login')>Sign up</span></p>
            </div>
        </div>
    </div>
`,
profile: `
    <div class="max-w-[1000px] mx-auto mt-12 p-8">
        <div class="flex flex-col items-center mb-10">
            <img src="assets/girl.png" class="w-24 h-24 rounded-full border">
            <h2 class="text-2xl font-bold mt-4" id="profile-name">Sophia Bennett</h2>
            <p class="text-gray-500">Quiz Enthusiast | Joined 2021</p>
        </div>

        <div class="flex gap-8 border-b mb-8 font-semibold">
            <span class="cursor-pointer">Activity</span>
            <span class="cursor-pointer border-b-2 border-black pb-2">Profile</span>
        </div>

        <div class="mb-12">
            <h3 class="text-xl font-bold mb-6">Personal Information</h3>
            <div class="grid grid-cols-2 gap-y-6">
                <div>
                    <p class="text-sm text-gray-500">Name</p>
                    <p class="font-medium" id="profile-full-name"></p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium" id="profile-email"></p>
                </div>
                <div class="col-span-2">
                    <p class="text-sm text-gray-500">Bio</p>
                    <p class="font-medium">Avid quiz taker and trivia lover. Always up for a challenge!</p>
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-xl font-bold mb-4">Quiz History</h3>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-gray-500 border-b">
                        <th class="py-3">Quiz Name</th>
                        <th class="py-3">Score</th>
                        <th class="py-3">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr><td class="py-4">General Knowledge</td><td>85/100</td><td>2025-08-15</td></tr>
                    <tr><td class="py-4">Science Trivia</td><td>70/100</td><td>2025-08-10</td></tr>
                </tbody>
            </table>
        </div>
    </div>
`,
quizzes : `

    <div class="max-w-[1200px] mx-auto p-10">
    <h1 class="text-3xl font-bold mb-6">Select a Quiz</h1>
    <div class="flex gap-4 mb-10">
        ${['All', 'Science', 'History', 'Literature', 'Math'].map(cat => 
            `<button class="px-5 bg-gray py-2 border rounded-full hover:bg-gray-100">${cat}</button>`
        ).join('')}
    </div>

    <h2 class="text-2xl font-bold mb-6">Featured Quizzes</h2>
    <div class="grid grid-cols-3 gap-6 mb-16" id="featured-list"></div>

    <h2 class="text-2xl font-bold mb-6">All Quizzes</h2>
    <div class="flex flex-col gap-8" id="all-quizzes-list"></div>
</div>
`,
activeQuiz : `
    <div class="max-w-[800px] mx-auto p-10">
        <h3 class="text-xl font-bold mb-4">Progress</h3>
        <div class="w-full bg-gray-200 h-2 rounded-full mb-2">
            <div id="progress-bar" class="bg-black h-2 rounded-full" style="width: 0%"></div>
        </div>
        <p id="q-count" class="text-sm text-gray-500 mb-8"></p>

        <div class="flex gap-8 mb-10">
            <div><h2 class="text-2xl font-bold">00</h2><p class="text-xs">Hours</p></div>
            <div><h2 class="text-2xl font-bold">00</h2><p class="text-xs">Minutes</p></div>
            <div><h2 class="text-2xl font-bold" id="timer">30</h2><p class="text-xs">Seconds</p></div>
        </div>

        <div id="question-area">
            </div>
    </div>
`,
result : `
    <div class="max-w-[800px] mx-auto p-10 text-center">
        <h2 class="text-3xl font-bold mb-6">Quiz Results</h2>
        <div class="bg-gray-50 p-8 rounded-xl mb-6">
            <h1 class="text-5xl font-bold" id="final-score"></h1>
        </div>
        <div class="flex gap-4 justify-center">
            <button class="border-2 px-8 py-3 rounded-lg" onclick="renderReview()">Review Answers</button>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-lg" onclick="render('quizzes')">Take Another Quiz</button>
        </div>
    </div>
`,
review : `
    <div class="max-w-[800px] mx-auto p-10">
        <h2 class="text-3xl font-bold mb-8">Review Incorrect Answers</h2>
        <div id="review-list" class="flex flex-col gap-6"></div>
        <button class="mt-8 bg-blue-600 text-white px-6 py-2 rounded" onclick="render('quizzes')">Back to Quizzes</button>
    </div>
`
};
function init() {
    root.innerHTML = navBar; 
    render('home');         
}
/*Render Function is traffic controller. injects HTML into app.container
Logic for render: 
1. Check if user is logged in 
2. views that require login 
3. If user tries to access protected view alert message is displayed , otherwise render
4. Trigger functions for specific pages 
5. Update Navbar for different pages */
function render(viewName) {
    const isLoggedIn = localStorage.getItem('quizUser');
    
    const protectedViews = ['quizzes', 'activeQuiz', 'profile'];

    if (protectedViews.includes(viewName) && !isLoggedIn) {
        alert("You must be logged in to access this page!");
        render('login'); 
        return; 
    }
    const container = document.getElementById('app-container');
    container.innerHTML = views[viewName] || "<h1>404 Page Not Found</h1>";
    if (viewName === 'profile') displayInfo();
    if (viewName === 'quizzes') displayQuizzes();
    
    const logo = document.getElementById('nav-logo');
    logo.innerText = (viewName === 'home') ? "Quiz Master" : "Quiz App";
    
    window.scrollTo(0, 0);
}

/* Logic for SaveUser
1. Get values from user 
2. Perform checks on data 
3. Store information in array 
4. Store information in browser using JSON (it will create single string format)
 */
function saveUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("c-password").value;

    if (!name || !email || password.length < 6) {
        alert("Please fill all fields. Password must be 6+ chars.");
        return;
    }
    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const user = { name, email,password };
    localStorage.setItem('quizUser', JSON.stringify(user));
    alert(`Account created for ${name}!`);
    render('login');
}
/*Logic for UserLogin()
1. Get input from user 
2. Retrieve information from localStorage 
3. Compare */
function userLogin() {
    const userEmailInput = document.getElementById('UserEmail').value; 
    const userPasswordInput = document.getElementById('UserPassword').value;

    const storedinfo = localStorage.getItem('quizUser');
    
    if (!storedinfo) {
        alert("No user found!");
        return;
    }

    const user = JSON.parse(storedinfo);
    if (user.email === userEmailInput && user.password === userPasswordInput) {
        render('profile');
    } else {
        alert("Invalid email or password!");
    }
}
function displayInfo() {
    const nameTab = document.getElementById("profile-full-name");
    const emailTab = document.getElementById("profile-email");
    const nameHeading= document.getElementById("profile-name");
    const storedUser = localStorage.getItem('quizUser');
    
    if (!storedUser) {
        console.warn("No user data found in storage.");
        return;
    }

    try {
        const user = JSON.parse(storedUser);
        if (nameTab && emailTab) {
            nameTab.textContent = user.name;
            emailTab.textContent = user.email;
            nameHeading.textContent=user.name;
        }
    } catch (e) {
        console.error("Error parsing user data:", e);
    }
}

/* Logic for RenderQuestion: 
1. get index from questions array 
2. Display progress
3.${q.options.map(...).join('')} looks at the options array for the current question and, for every option, it creates a custom HTML <label> and <input> tag.*/
function renderQuestion() {
    const q = currentQuiz.questions[currentIdx];
    const container = document.getElementById('question-area');
    const progressBar = document.getElementById('progress-bar');
    const countText = document.getElementById('q-count');
    const progress = ((currentIdx) / currentQuiz.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    countText.innerText = `Question ${currentIdx + 1} of ${currentQuiz.questions.length}`;

container.innerHTML = `
    <h2 class="text-2xl font-bold mb-6">${q.question}</h2>
    <div class="flex flex-col gap-4">
        ${q.options.map(opt => `
            <label class="border-2 p-4 rounded-xl hover:border-black transition flex items-center gap-3 cursor-pointer">
                <input type="radio" name="quiz-option" value="${opt}" onclick="checkAnswer('${opt}')" class="w-5 h-5">
                ${opt}
            </label>
        `).join('')}
    </div>
`;
}
/* Logic for displayQuizess:  Map quiz information for display */
function displayQuizzes() {
    const featured = document.getElementById('featured-list');
    const all = document.getElementById('all-quizzes-list');

    featured.innerHTML = featuredQuizzes.map(q => `
        <div class="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-lg transition cursor-pointer" onclick="startQuiz(${q.id})">
            <img src="${q.image}" class="w-full h-40 object-cover rounded-xl mb-4">
            <h3 class="font-bold text-lg">${q.title}</h3>
            <p class="text-sm text-gray-500 mt-1">${q.description}</p>
        </div>
    `).join('');

    all.innerHTML = allQuizzes.map(q => `
        <div class="flex items-center justify-between border-b pb-6 mb-6 cursor-pointer hover:bg-gray-50 transition" onclick="startQuiz(${q.id})">
            <div class="flex-1 pr-6">
                <h3 class="font-bold text-xl">${q.title}</h3>
                <p class="text-gray-600 mt-2">${q.description}</p>
            </div>
            <img src="${q.image}" class="w-32 h-20 object-cover rounded-lg">
        </div>
    `).join('');
}
/* Logic for startQuiz:
1.find id of quiz with user's selection 
2. refreshes score */
function startQuiz(id) {
    const foundQuiz = allQuizzes.find(q => q.id === id) || featuredQuizzes.find(q => q.id === id);
    if (!foundQuiz) return;

    currentQuiz = foundQuiz;
    currentIdx = 0;
    score = 0;
    userAnswers = [];
    
    render('activeQuiz');
    startTimer();
    
    setTimeout(renderQuestion, 50); 
}
/* Logic for startTimer
1. counts time left from 30 */
function startTimer() {
    timeLeft = 30; 
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            render('quizzes'); 
        }
    }, 1000);
}
/* Processes the user's selected answer by storing their choice in the global userAnswers array.
   It compares the selection against the correct answer to increment the score if accurate.
   Finally, it triggers the next question or terminates the quiz if all questions are completed.
*/
function checkAnswer(selected) {
    const q = currentQuiz.questions[currentIdx];
    
    userAnswers.push({
        question: q.question,
        selected: selected,
        correct: q.answer
    });

    if (selected === q.answer) score++;

    currentIdx++;
    if (currentIdx < currentQuiz.questions.length) {
        renderQuestion();
    } else {
        clearInterval(timerInterval);
        render('result');
        document.getElementById('final-score').innerText = `${score}/${currentQuiz.questions.length}`;
    }
}
/* Processes the user's selected answer by storing their choice in the global userAnswers array.
   It compares the selection against the correct answer to increment the score if accurate.
   Finally, it triggers the next question or terminates the quiz if all questions are completed.
*/
function renderReview() {
    render('review');
    const list = document.getElementById('review-list');
    const wrongAnswers = userAnswers.filter(a => a.selected !== a.correct);
    
    list.innerHTML = wrongAnswers.map((a, index) => `
        <div class="border-b pb-4">
            <p class="font-bold">Question ${index + 1}: ${a.question}</p>
            <p class="text-red-500">Your answer: ${a.selected}</p>
            <p class="text-green-600">Correct answer: ${a.correct}</p>
        </div>
    `).join('');
}
init();