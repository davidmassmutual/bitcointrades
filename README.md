# BitcoinInvest - Fake Bitcoin Investment Website

A comprehensive fake Bitcoin investment platform built with React, Node.js, MongoDB, and vanilla CSS. Features a Coinbase-style dashboard, real-time Bitcoin prices, user management, and admin controls.

## Features

### User Features
- **Coinbase-Style Dashboard**: Modern, responsive dashboard showing portfolio value, Bitcoin holdings, and profit/loss
- **Real-time Bitcoin Prices**: Live price updates using cryptocurrency APIs (CoinGecko, CoinMarketCap)
- **Investment System**: Users can invest in Bitcoin and watch their portfolio grow
- **Transaction History**: Complete transaction tracking with filters and search
- **User Authentication**: Secure login/registration with JWT tokens
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **User Management**: View, activate/deactivate users, adjust balances
- **Transaction Monitoring**: View all platform transactions
- **Admin Dashboard**: Platform statistics and metrics
- **Manual Adjustments**: Add manual transactions and balance adjustments

### Technical Features
- **Real-time Updates**: Live Bitcoin price updates every 30 seconds
- **Secure Backend**: JWT authentication, password hashing, input validation
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: Multiple cryptocurrency API fallbacks
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Vanilla CSS with custom design system

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Axios for external API calls

### APIs Used
- CoinGecko API (primary)
- CoinMarketCap API (fallback)
- Mock prices (emergency fallback)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd btc-investment
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://db_user:bitcointrade@cluster0.qjsnxk4.mongodb.net/btc_investment?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   CMC_API_KEY=your_coinmarketcap_api_key (optional)
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both frontend (on port 3000) and backend (on port 5000) servers.

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
btc-investment/
├── backend/                    # Node.js backend server
│   ├── models/                 # MongoDB models
│   │   ├── User.js            # User model
│   │   └── Transaction.js     # Transaction model
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   ├── transactions.js   # Transaction routes
│   │   └── admin.js          # Admin routes
│   ├── middleware/           # Express middleware
│   │   └── auth.js          # Authentication middleware
│   ├── services/             # External services
│   │   └── priceService.js  # Bitcoin price service
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Investment.js
│   │   │   ├── Transactions.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminPanel.js
│   │   │   ├── Home.js
│   │   │   └── LoadingSpinner.js
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── package.json             # Root package.json
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `GET /api/users/portfolio` - Get portfolio with live prices
- `GET /api/users/transactions` - Get user transactions
- `POST /api/users/deposit` - Add funds to balance
- `POST /api/users/invest` - Invest in Bitcoin

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/dashboard` - Get admin statistics
- `PUT /api/admin/users/:id/status` - Activate/deactivate user
- `PUT /api/admin/users/:id/balance` - Adjust user balance
- `PUT /api/admin/users/:id/btc-balance` - Adjust user BTC balance

## Usage

### For Users
1. Register for a new account
2. Log in to access your dashboard
3. View your portfolio and current Bitcoin prices
4. Make investments in Bitcoin
5. Track your transaction history
6. Monitor your portfolio growth

### For Admins
1. Log in with an admin account
2. Access the admin panel from the navigation
3. View platform statistics and user metrics
4. Manage users (activate/deactivate, adjust balances)
5. Monitor all transactions across the platform

### Creating Admin Users
To create an admin user, you'll need to update a user's `isAdmin` field to `true` in the MongoDB database directly, or modify the registration logic temporarily.

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Cross-origin resource sharing protection
- **Rate Limiting**: API rate limiting to prevent abuse

## Development

### Adding New Features
1. Create database models in `backend/models/`
2. Add API routes in `backend/routes/`
3. Create React components in `frontend/src/components/`
4. Update the main App.js to include new routes
5. Style components using the existing CSS system

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `CMC_API_KEY`: CoinMarketCap API key (optional)

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and the URI is correct
2. **CORS Errors**: The backend includes CORS middleware, but check if additional configuration is needed
3. **API Rate Limits**: If cryptocurrency APIs return errors, the system will fall back to mock prices
4. **Port Conflicts**: Ensure ports 3000 and 5000 are available

### Development Tips
- Use browser developer tools to monitor API calls
- Check the backend console for server-side errors
- Use MongoDB Compass to inspect database data
- Monitor network requests for API response times

## License

This project is for educational purposes only. It simulates a Bitcoin investment platform but does not provide real financial services.

## Disclaimer

⚠️ **WARNING**: This is a fake investment platform for educational purposes only. It does not provide real financial services or handle actual cryptocurrency transactions. Do not use real money or sensitive information with this application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support and questions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Ensure all dependencies are properly installed

## Future Enhancements

Potential features for future development:
- Real-time WebSocket price updates
- Advanced charting and analytics
- Mobile app version
- Additional cryptocurrency support
- Advanced trading features
- Two-factor authentication
- Email notifications
- Referral system