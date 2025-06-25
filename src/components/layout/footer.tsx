'use client';

import { useState } from 'react';
import { InfoDialog } from './info-dialog';
import { SupportChat } from './support-chat';

export function Footer() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });
  const [supportChatOpen, setSupportChatOpen] = useState(false);

  const showInfoDialog = (title: string, content: string) => {
    setDialogContent({ title, content });
    setDialogOpen(true);
  };

  const contactContent = `You can reach us at the following address:

SpendWise Inc.
123 Finance Street
Budget City, 12345
World

Email: contact@spendwise.example.com
Phone: (123) 456-7890`;

  const privacyContent = `Last updated: ${new Date().toLocaleDateString()}

1. Introduction
Welcome to SpendWise. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.

2. Information We Collect
We may collect personal information such as your name, email address, and financial data that you provide to us voluntarily.

3. How We Use Your Information
We use the information we collect to:
- Provide, operate, and maintain our application
- Improve, personalize, and expand our application
- Understand and analyze how you use our application
- Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the app.

4. Data Security
We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.`;

  const termsContent = `Last updated: ${new Date().toLocaleDateString()}

1. Agreement to Terms
By using the SpendWise application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.

2. Description of Service
SpendWise is a personal finance management application that allows users to track their income and expenses, set budgets, and gain insights into their spending habits. This application is a prototype and should not be used for managing real financial data.

3. User Accounts
You are responsible for safeguarding your account and for any activities or actions under your account.

4. Limitation of Liability
In no event shall SpendWise, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`;

  return (
    <>
      <footer className="border-t bg-primary text-primary-foreground">
        <div className="container mx-auto py-6 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>&copy; {new Date().getFullYear()} SpendWise. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
              <button
                onClick={() => setSupportChatOpen(true)}
                className="hover:underline bg-transparent border-none p-0 cursor-pointer text-primary-foreground"
              >
                Support
              </button>
              <button
                onClick={() => showInfoDialog('Contact Us', contactContent)}
                className="hover:underline bg-transparent border-none p-0 cursor-pointer text-primary-foreground"
              >
                Contact Us
              </button>
              <button
                onClick={() => showInfoDialog('Privacy Policy', privacyContent)}
                className="hover:underline bg-transparent border-none p-0 cursor-pointer text-primary-foreground"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => showInfoDialog('Terms of Service', termsContent)}
                className="hover:underline bg-transparent border-none p-0 cursor-pointer text-primary-foreground"
              >
                Terms of Service
              </button>
            </nav>
          </div>
        </div>
      </footer>
      
      <InfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogContent.title}
        content={dialogContent.content}
      />
      
      <SupportChat open={supportChatOpen} onOpenChange={setSupportChatOpen} />
    </>
  );
}
