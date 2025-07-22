# How to Sync & Deploy Your Zenit Tracker App

This guide provides the step-by-step process to get the corrected code from this cloud development environment, update your local project, and deploy it to the web.

---

### **Syncing The Corrected Code to Your Local Machine**

The code in this cloud environment has been fixed. The code on your local computer at `D:\Zenit-Tracker` is outdated. The following commands will sync the corrected code from the cloud repository directly to your local folder.

**Run these commands in your local terminal (like PowerShell or VS Code terminal) inside your `D:\Zenit-Tracker` folder.**

1.  **Add the Cloud Repo as a "Remote":**
    *   This command tells your local Git about the cloud repository. You only need to do this once. Give it a name like `firebase-studio`.

    ```bash
    # Replace the URL with the actual URL of your Firebase Studio Git repository
    git remote add firebase-studio YOUR_STUDIO_GIT_REPOSITORY_URL 
    ```
    *   *Note: If you get an error that `firebase-studio` already exists, you can skip this step.*

2.  **Fetch the Code from the Cloud Repo:**
    *   This downloads all the latest branches and commits from the cloud environment without touching your local files yet.

    ```bash
    git fetch firebase-studio
    ```

3.  **Merge the Fixes into Your Main Branch:**
    *   This command merges the changes from the cloud environment's `main` branch into your local `main` branch.

    ```bash
    # Make sure you are on your main branch first
    git checkout main

    # Now, merge the changes
    git merge firebase-studio/main
    ```

Your local code is now up-to-date with all the fixes we have made. You can now proceed with the standard setup and deployment steps from your own computer.

---

## Phase 1: Set Up Your Free Backend (Firebase)

If you have already done this, you can skip to Phase 2. Your app needs a database and user authentication. Firebase's free "Spark Plan" is perfect for this.

1.  **Create Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and click "Add project". Follow the on-screen steps.

2.  **Enable Authentication:**
    *   In your new project, go to the **Authentication** section.
    *   Click "Get started".
    *   Under "Sign-in providers", enable **Email/Password** and **Google**.

3.  **Set Up Firestore Database:**
    *   Go to the **Firestore Database** section.
    *   Click "Create database".
    *   Start in **Production mode**. Choose a server location (e.g., `us-central`).
    *   After it's created, go to the **Rules** tab.
    *   Replace the existing rule with this to allow only logged-in users to access their own data:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId} {
              allow read, write: if request.auth.uid == userId;
            }
            match /testSessions/{sessionId} {
              allow read, update, delete: if request.auth.uid == resource.data.userId;
              allow create: if request.auth.uid == request.resource.data.userId;
            }
          }
        }
        ```
    *   Click **Publish**.

4.  **Get Your Firebase Keys:**
    *   In your Firebase project, click the gear icon ⚙️ and select **Project settings**.
    *   Scroll down to the "Your apps" card and click the **</>** icon to register a new web app.
    *   Give it a nickname and click "Register app".
    *   You will see an object called `firebaseConfig`. Copy the values for `apiKey`, `authDomain`, and `projectId`.

## Phase 2: Run the App on Your Computer

Now that your local code is updated, let's get it running.

1.  **Open Project in VS Code:**
    *   Open Visual Studio Code.
    *   Go to `File > Open Folder...` and select your `D:\Zenit-Tracker` folder.

2.  **Create `.env.local` File:**
    *   In VS Code's file explorer, right-click and select "New File". Name it exactly **`.env.local`**.
    *   Paste your Firebase keys into this file like this (replace with your actual keys):
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_FROM_FIREBASE
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_FROM_FIREBASE
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_FROM_FIREBASE
        ```
    *   Save the file.

3.  **Install App Dependencies:**
    *   In VS Code, open a new terminal (`Terminal > New Terminal`).
    *   Type this command and press Enter:
        ```
        npm install
        ```

4.  **Run the App Locally:**
    *   After `npm install` finishes, type this command in the same terminal:
        ```
        npm run dev
        ```
    *   Open your web browser and go to **`http://localhost:3000`**. You should see the app running!

## Phase 3: Deploy Your App to the Web for Free

This phase puts your app on the internet. We will use GitHub to store your code and Vercel to host it for free.

1.  **Push Your Code to GitHub:**
    *   Create a free account on [GitHub](https://github.com/).
    *   Create a **new, empty repository**. Do not add a README.
    *   After creating it, GitHub will give you a URL like `https://github.com/your-username/your-repo.git`.
    *   In your VS Code terminal (press `Ctrl + C` to stop the app first), run these commands one by one, replacing the URL with your own:
        ```bash
        git init -b main
        git add .
        git commit -m "Initial commit of Zenit Tracker"
        git remote add origin YOUR_REPOSITORY_URL_FROM_GITHUB
        git push -u origin main
        ```

2.  **Deploy with Vercel:**
    *   Go to [Vercel.com](https://vercel.com/) and sign up for a free Hobby account using your GitHub account.
    *   On your Vercel dashboard, click **Add New... > Project**.
    *   Find and **Import** your GitHub repository.
    *   Expand the **Environment Variables** section. Add the same three `NEXT_PUBLIC_FIREBASE...` keys and values from your `.env.local` file.
    *   Click **Deploy**.

Vercel will build and deploy your application, giving you a public URL to share. You have successfully deployed your application!
