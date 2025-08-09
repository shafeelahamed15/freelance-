# FreelancePro - Professional Freelancer Onboarding & Invoice Tool

A comprehensive platform for freelancers to streamline client onboarding, create professional invoices, and automate workflow processes.

## 🚀 Features

- **Client Onboarding**: Create branded welcome messages, scope documents, and timelines
- **Professional Invoices**: Generate beautiful invoices with payment tracking
- **Automated Workflows**: Set up processes once and let automation handle the rest
- **Brand Customization**: Personalize with your logo, colors, and branding
- **Real-time Tracking**: Monitor payment status and client progress
- **Secure Authentication**: Firebase-powered user management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Deployment**: Vercel/Firebase Hosting
- **Styling**: Tailwind CSS with Heroicons

## 🏗️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

Your Firebase configuration is already set up in `.env.local` with project ID: `freelanceeasy-c6e6e`

To deploy security rules and indexes:

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (select existing project)
firebase use freelanceeasy-c6e6e

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### 3. Enable Firebase Services

In your Firebase Console (https://console.firebase.google.com/project/freelanceeasy-c6e6e):

1. **Authentication**: Enable Email/Password provider
2. **Firestore Database**: Create database in production mode
3. **Storage**: Enable Firebase Storage for file uploads

### 4. Set up Resend (Email Service)

1. Go to [Resend.com](https://resend.com) and create a free account
2. Get your API key from the dashboard
3. Add your Resend API key to `.env.local`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=your_verified_email@domain.com
   ```
4. Verify your domain or use Resend's sandbox for testing

### 5. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login/Register pages
│   ├── dashboard/         # Main dashboard
│   ├── clients/           # Client management
│   ├── invoices/          # Invoice system
│   └── settings/          # User settings
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
└── types/                 # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

The application uses Firebase Authentication and Firestore security rules to ensure:
- Users can only access their own data
- Proper authentication for all operations
- Secure client portal access

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## 🎯 Next Steps

1. **Enable Firebase Authentication Email/Password**
2. **Create Firestore database**
3. **Deploy security rules**
4. **Set up Resend email service** - Get your API key and add to `.env.local`
5. **Add additional features like:**
   - Payment integration (Stripe)
   - Advanced client portal
   - Real-time notifications
   - Analytics dashboard

## 🔥 **Current Features**

### ✅ **Core Functionality**
- **User Authentication** - Secure Firebase Auth
- **Client Management** - Full CRUD with search and filtering
- **AI Template Generator** - OpenAI-powered content creation
- **Email System** - Resend integration with beautiful templates
- **Dashboard** - Professional overview with metrics
- **Responsive Design** - Works on all devices

### 🤖 **AI-Powered Features**
- **Smart Templates** - Generate welcome messages, scope documents, timelines
- **Content Suggestions** - AI-driven project recommendations
- **Professional Emails** - Branded email templates with variables

### 📧 **Email Capabilities**
- **Welcome Emails** - Automated client onboarding
- **Invoice Emails** - Professional billing notifications  
- **Custom Templates** - Personalized communication
- **Email Testing** - Built-in service verification

## 📧 Support

For questions or support, please create an issue in the repository.

---

Built with ❤️ for freelancers by freelancers.
