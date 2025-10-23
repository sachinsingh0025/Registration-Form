

🧩 How to Edit the Code (Locally on Your PC)
1️⃣ Install Requirements

Make sure you have Node.js and npm installed.

You can check by running:

node -v
npm -v


If not installed, download via: https://nodejs.org

Or install via nvm:

nvm install node
nvm use node

2️⃣ Clone the Repository

In your terminal or VS Code:

git clone <YOUR_GIT_URL>


(Replace <YOUR_GIT_URL> with your actual GitHub repo link — e.g., https://github.com/username/registration-form.git)

3️⃣ Open the Project Folder
cd <YOUR_PROJECT_NAME>


Or open it directly in VS Code:

code .

4️⃣ Install Dependencies

Run:

npm i


This installs all the packages like React, Tailwind, shadcn-ui, etc.

5️⃣ Run the App

Start the development server:

npm run dev


Then open the local link (e.g., http://localhost:5173) shown in the terminal.

You can now edit files (like /src/App.tsx, /src/components/...) and see instant updates in your browser.

🧠 Alternative: Edit Directly on GitHub

You can also:

Go to your GitHub repo page.

Open any file.

Click the ✏️ Edit (pencil icon).

Make changes.

Scroll down → Write a commit message → Click Commit changes.

GitHub will automatically save it to your branch.

🛠 Technologies Used
Technology	Purpose
Vite	Fast dev server & build tool
React	Frontend library for UI
TypeScript	Adds type safety to JavaScript
Tailwind CSS	Utility-first CSS framework
shadcn/ui	Ready-to-use styled components


