# Theoforge Dashboard

A modern, feature-rich dashboard application built with React, TypeScript, and Material Tailwind. This application provides a comprehensive interface for managing users, guests, and marketplace functionalities with a focus on AI solutions and business services.

## Features

- 🔐 **Authentication System**
  - Secure login/register functionality
  - Protected routes
  - Session management
  - Test account access

- 🎨 **Modern UI/UX**
  - Responsive design
  - Material Tailwind components
  - Heroicons integration
  - Clean and intuitive interface

- 📊 **Dashboard Features**
  - User management
  - Guest tracking
  - Marketplace (coming soon)
  - Account settings
  - Collapsible sidebar
  - Breadcrumb navigation

- 💼 **Business Features**
  - ETL Solutions
  - Knowledge Graphs
  - Custom LLM Training
  - AI Consulting

- 💬 **Interactive Chat**
  - Real-time conversation
  - Project requirement gathering
  - Automated responses
  - Contact information collection

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Material Tailwind
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/theoforge-dashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd theoforge-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Test Account

You can use the following credentials to test the application:
- Email: test@test.com
- Password: test123

## Project Structure

```
src/
├── components/         # React components
│   ├── AuthForm.tsx   # Login/Register forms
│   ├── ChatBox.tsx    # Interactive chat component
│   ├── Dashboard.tsx  # Main dashboard layout
│   ├── UsersTable.tsx # Users management
│   └── GuestsTable.tsx# Guest management
├── lib/               # Utility functions
├── App.tsx           # Root component
└── main.tsx         # Application entry point
```

## Features in Detail

### Authentication
- Email/password authentication
- Protected routes using React Router
- Persistent session management
- Secure token handling

### Dashboard
- **Users Management**
  - View all users
  - Edit user details
  - Delete users
  - Status tracking
  - Search functionality
  - Pagination

- **Guests Management**
  - Track potential clients
  - Manage guest information
  - Status updates
  - Contact details
  - Project type tracking

- **Account Settings**
  - Personal information management
  - Payment methods
  - Subscription details
  - Profile updates

### Interactive Chat
- Real-time conversation flow
- Automated response system
- Project requirement collection
- Industry-specific questions
- Contact information gathering

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code linting with the following configurations:
- React hooks rules
- TypeScript recommended rules
- Import sorting
- Proper formatting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material Tailwind](https://material-tailwind.com/)
- [Heroicons](https://heroicons.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)