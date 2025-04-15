# Energy Accounts Payment System

A React + Node.js application that allows users to view their energy accounts and make credit card payments.

## 🚀 Features

- View energy accounts with balance information
- Filter accounts by energy type (Gas/Electricity)
- Make credit card payments with real-time validation
- Responsive design with modern UI components
- TypeScript throughout frontend and backend
- Comprehensive test coverage

## 🛠 Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui for UI components
- React Hook Form for form management
- Vitest for testing

### Backend

- Node.js with Express
- TypeScript
- Jest for testing

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation & Running

1. Clone the repository
2. Install dependencies:

```bash
# Install backend dependencies
cd codebase/server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Start the servers:

```bash
# Start backend (from server directory)
npm start

# Start frontend (from client directory)
npm start
```

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:5173

## 🧪 Testing

Both frontend and backend include comprehensive test suites:

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 📝 Implementation Notes

### Frontend Architecture

- Component-based architecture with reusable UI components
- Custom hooks for data fetching and state management
- Form validation with real-time feedback
- Responsive design that works across devices
- Error handling and loading states

### Backend Architecture

- RESTful API design
- Service layer pattern for business logic
- Mock data store for accounts and payments

### Future Improvements

- Add authentication/authorization
- Implement real payment gateway integration
- Add pagination for accounts list
- Add more comprehensive error handling
- Add loading skeletons for better UX
- Add E2E tests with Cypress
- Add proper logging system
- Add proper environment configuration

## 🎯 Requirements Met

### Frontend

✅ Fetch and display energy accounts
✅ Card UI format with stacked layout
✅ Color-coded account balances
✅ Energy type filtering
✅ Payment modal with form validation
✅ Success/failure states for payments

### Backend

✅ RESTful endpoints for accounts and payments
✅ Mock data implementation
✅ Error handling
✅ TypeScript integration

## 📚 API Documentation

### Endpoints

#### GET /api/accounts

Returns list of energy accounts

#### POST /api/payment

Process payment for an account

Request body:

```typescript
{
  accountId: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}
```

## 👤 Author

Simon Qi

## 📄 License

MIT
