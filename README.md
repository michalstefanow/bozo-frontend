# BOZO Crypto Game

> 🎮 **Bitcoin-powered fortune telling game** - Connect your wallet, purchase cards with rune tokens, and discover your digital fortune through an interactive card-based experience built on the Bitcoin network.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-Integration-orange?style=flat&logo=bitcoin)](https://bitcoin.org/)
[![Sats Connect](https://img.shields.io/badge/Sats%20Connect-Wallet%20API-green?style=flat)](https://docs.sats-connect.com/)

A Next.js-based Bitcoin crypto game that integrates with Bitcoin wallets through Sats Connect, featuring fortune telling mechanics and rune token transactions.

## 🎮 Project Overview

BOZO is an interactive crypto game built on the Bitcoin network that allows users to:
- Connect Bitcoin wallets (payment, ordinals, and stacks addresses)
- Purchase fortune cards using rune tokens
- Experience animated fortune telling gameplay
- Manage digital card collections

## ✨ Features

### 🔗 Wallet Integration
- **Multi-address support**: Payment, Ordinals, and Stacks addresses
- **Sats Connect integration**: Seamless wallet connection
- **Bitcoin transaction signing**: Secure PSBT-based transactions
- **Network support**: Mainnet and testnet compatibility

### 🎯 Game Mechanics
- **Fortune telling interface**: Interactive card-based gameplay
- **Rune token transactions**: Purchase cards using Bitcoin runes
- **Card collection system**: Collect and manage digital cards
- **Animated UI**: Smooth transitions and visual effects using Framer Motion

### 🛠 Technical Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern responsive styling
- **React Query**: Efficient data fetching and caching
- **Local storage**: Persistent user state
- **Bitcoin.js**: Advanced Bitcoin transaction handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A Bitcoin wallet with Sats Connect support (e.g., Xverse, Unisat)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/michalstefanow/bozo-frontend.git
   cd bozo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Bozo.tsx          # Main game component
│   ├── Game.tsx          # Game state management
│   ├── Intro.tsx         # Wallet connection interface
│   ├── Fortune.tsx       # Main game interface
│   ├── Pack.tsx          # Card pack component
│   ├── OpenPack.tsx      # Pack opening animation
│   ├── GetFortune.tsx    # Fortune telling interface
│   ├── Account.tsx       # User account management
│   └── ...               # Other UI components
├── contexts/             # React contexts
│   └── AppState.tsx      # Global application state
├── hooks/                # Custom React hooks
│   └── LocalStorage.ts   # Local storage utilities
├── api/                  # API functions
│   └── api.ts           # Bitcoin and game API calls
└── fonts/               # Custom fonts
    └── fonts.ts         # Font configuration
```

## 🔧 Key Technologies

### Frontend
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Query**: Data fetching and caching

### Bitcoin Integration
- **Sats Connect**: Bitcoin wallet connection standard
- **Bitcoin.js**: Bitcoin transaction library
- **Runelib**: Rune token handling
- **ECPair**: Bitcoin key management

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🎮 Game Flow

1. **Wallet Connection**: Users connect their Bitcoin wallet through the intro screen
2. **Address Setup**: The app requests payment, ordinals, and stacks addresses
3. **Fortune Interface**: Users can purchase fortune cards using rune tokens
4. **Transaction Process**: 
   - Create PSBT for rune token transfer
   - Sign transaction with wallet
   - Broadcast transaction to Bitcoin network
5. **Card Collection**: Users receive digital cards after successful transactions
6. **Account Management**: Users can view their collection and manage their account

## 🔐 Security Features

- **PSBT-based transactions**: Secure Bitcoin transaction signing
- **Wallet integration**: No private key exposure
- **Network validation**: Proper Bitcoin network handling
- **Error handling**: Comprehensive error management

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📝 API Endpoints

The game integrates with several APIs:
- **Rune Whisperers API**: Card management and game logic
- **Unisat API**: Bitcoin transaction data
- **Blockchain.info**: Bitcoin balance checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

