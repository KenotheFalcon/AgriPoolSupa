# AgriPool NG

A Next.js application for connecting local farmers with buyers in Nigeria.

## Features

- 🔐 Secure authentication with Firebase
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔄 Real-time updates
- 📧 Email verification
- 🔑 Password reset functionality
- 👤 User profile management

## Tech Stack

- Next.js 13.5
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Firestore)
- Radix UI Components
- React Hook Form
- Zod Validation

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/agripool-ng.git
   cd agripool-ng
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
└── styles/               # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security

- Rate limiting on authentication endpoints
- CSRF protection
- Secure session management
- Input validation with Zod
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
