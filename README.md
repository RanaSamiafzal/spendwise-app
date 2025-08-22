# SpendWise: Personal Finance Dashboard

SpendWise is a modern personal finance dashboard designed to help users track their income and expenses, set budgets, and gain AI-powered insights into their spending habits.

This application is a feature-rich prototype built with a modern web stack. It uses mock data for demonstration purposes and is not intended for use with real financial information in its current state.

## Key Features

- **Interactive Dashboard**: An overview of balances, recent transactions, and spending charts.
- **Transaction Management**: Manually add or simulate syncing transactions from a bank.
- **AI-Powered Insights**: Use Genkit to clarify transaction descriptions, suggest categories, and analyze spending patterns.
- **Budget Tracking**: Set monthly budgets and monitor progress.
- **Responsive Design**: A clean and intuitive layout that works across devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) with [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Genkit (Google)](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) or [Firebase App Hosting](httpss://firebase.google.com/docs/app-hosting)

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## Deployment

You have two excellent options for deploying this application. Vercel is highly recommended for its simplicity and generous free tier that does not require a credit card.

### Option 1: Deploying with Vercel (Recommended)

Vercel is the creator of Next.js and offers a seamless deployment experience.

1.  **Push your code to a Git repository** (e.g., on GitHub, GitLab, or Bitbucket).
2.  **Sign up for Vercel**: Go to [vercel.com](https://vercel.com) and create a free account.
3.  **Import Project**: From the Vercel dashboard, click "Add New... > Project" and import your Git repository.
4.  **Deploy**: Vercel will automatically detect the Next.js framework and configure the build settings. Simply click the "Deploy" button.

Vercel will handle the rest and provide you with a public URL for your live application.

### Option 2: Deploying with Firebase App Hosting

This project is also configured for deployment with Firebase App Hosting. Note that this requires setting up a Firebase project and may require a billing account.

1.  **Create a Firebase Project**: If you don't have one, create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Install Firebase CLI**: If you haven't already, install the command-line tools: `npm install -g firebase-tools`.
3.  **Login to Firebase**: `firebase login`
4.  **Initialize App Hosting**: Run `firebase init apphosting` and follow the prompts to connect it to your Firebase project.
5.  **Deploy the App**: `firebase apphosting:backends:deploy`

After a few moments, the CLI will provide you with a URL to your live application.
