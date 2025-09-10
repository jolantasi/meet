# Meet App

A **serverless Progressive Web Application (PWA)** built with **React** and tested with a **Test-Driven Development (TDD)** approach.  
The app integrates with the **Google Calendar API** to fetch upcoming events and provides users with an intuitive, offline-first experience.

---

## App Key Features

1. **Filter Events by City** – Easily search for events in different cities.
   User story: As a user, I should be able to filter events by city,
   so that I can quickly find upcoming events relevant to my location of interest.

Scenario: Show upcoming events from all cities by default
Given the user has not searched for a city
When the app loads
Then the user should see a list of upcoming events from all cities

Scenario: Show list of suggestions when searching for a city
Given the main page is open
When the user types the name of a city
Then the user should see a list of suggested cities

Scenario: User can select a city from the suggested list
Given the user typed "Berlin" in the search bar
And the list of suggestions is visible
When the user selects "Berlin" from the suggestions
Then the user should see a list of upcoming events in Berlin

2. **Show/Hide Event Details** – Toggle event information to keep the interface clean.

User story: As a user, I should be able to expand or collapse event details,
so that I can decide whether I want a quick overview or detailed information.

Scenario: Event element is collapsed by default
Given the user is viewing a list of events
When the app loads
Then each event element should be collapsed by default

Scenario: Expand an event to see details
Given the list of events is displayed
When the user clicks on an event
Then the event details should expand and be visible

Scenario: Collapse an event to hide details
Given an event’s details are expanded
When the user clicks on the event again
Then the event details should collapse and be hidden

3. **Specify Number of Events** – Control how many events are displayed.

User story: As a user, I should be able to set the number of events displayed,
so that I can control the amount of information and avoid being overwhelmed.

Scenario: Default number of events is 32
Given the user has not specified the number of events
When the app loads
Then 32 events should be displayed by default

Scenario: User can change number of events displayed
Given the main page is open
When the user specifies "10" in the number of events field
Then the user should see only 10 events displayed

4. **Offline Usage** – Access previously loaded events without an internet connection.

User story: As a user, I should be able to access previously loaded events offline,
so that I can still use the app without an internet connection.

Scenario: Show cached data when offline
Given the user has previously loaded event data
And the user is offline
When the user opens the app
Then the user should see the cached events

Scenario: Show error when changing settings offline
Given the user is offline
When the user tries to change the city or number of events
Then the user should see an error message

5. **Add to Home Screen** – Install the app as a shortcut on your device.

User story: As a user, I should be able to add the app to my device home screen,
so that I can quickly access it like a native application.

Scenario: Install the Meet app as a home screen shortcut
Given the app is running in a supported browser
When the user accepts the "Add to Home Screen" prompt
Then the Meet app should be installed as a shortcut on their device home screen

6. **Charts & Visualizations** – See event trends and statistics at a glance.

User story: As a user, I should be able to see charts that visualize event details,
so that I can easily understand trends and patterns in the event data.

Scenario: Show chart with number of upcoming events per city
Given the user is viewing event data
When the charts section loads
Then the user should see a chart showing the number of upcoming events for each city

---

## 🛠️ Technologies

- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Google Calendar API](https://developers.google.com/calendar)
- [Workbox](https://developer.chrome.com/docs/workbox) for service workers
- [Recharts](https://recharts.org/) for data visualization
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) for TDD

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

   ```

2. **Install dependencies**
   npm install
   Run the app locally
   npm run dev
3. **Open http://localhost:5173/ in your browser.**

## 🧪 Testing

Run unit and integration tests with:
npm test

## 📦 Deployment

This app is serverless and can be deployed to:
Netlify
Vercel
GitHub Pages

## 👩‍💻 Author

Jolanta -
multilingual Web Development Student & Future Full-Stack Developer :)

## 📜 License

This project is licensed under the MIT License.

---

✨ Recommendation:

- Edit the README in **your code editor** (so it’s tracked with your commits).
- Then push it to GitHub (`git add . && git commit -m "Update README" && git push`).
