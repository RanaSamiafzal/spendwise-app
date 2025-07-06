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
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

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

This application is configured for easy deployment with **Firebase App Hosting**.

1.  **Create a Firebase Project**: If you don't have one, create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Install Firebase CLI**: Make sure you have the Firebase Command Line Interface installed globally.
    ```bash
    npm install -g firebase-tools
    ```
3.  **Login to Firebase**:
    ```bash
    firebase login
    ```
4.  **Initialize App Hosting**: In your project's root directory, run the initialization command and follow the prompts to connect it to your Firebase project.
    ```bash
    firebase init apphosting
    ```
5.  **Deploy the App**:
    ```bash
    firebase apphosting:backends:deploy
    ```
    After a few moments, the CLI will provide you with a URL to your live application.
