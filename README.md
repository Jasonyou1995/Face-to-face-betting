# PlayCheck: Real-World Verification Platform 🚀

![Logo](img/logo.jpg)

[![CI/CD Status](https://github.com/your-username/Face-to-face-betting/workflows/CI/badge.svg)](https://github.com/your-username/Face-to-face-betting/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=playcheck&metric=security_rating)](https://sonarcloud.io/dashboard?id=playcheck)

## 🌟 Project Overview

PlayCheck revolutionizes real-world event verification through a gamified, decentralized platform that combines cutting-edge blockchain technology, AI agents, and Zero-Knowledge Proofs. Our platform creates a trustworthy oracle system where users earn RLUSD rewards for accurate contributions to real-world data verification.

**This is a public-facing fundraising project showcasing production-ready architecture and best practices.**

---

## 🏗️ Architecture

Our platform is built on a robust, scalable architecture designed for enterprise-grade performance:

```
┌─────────────────────────────────────────────────────────────┐
│                    PlayCheck Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14)  │  Backend (Node.js/Express)      │
│  - TypeScript           │  - Microservices Architecture    │
│  - Tailwind CSS         │  - GraphQL + REST APIs          │
│  - PWA Support          │  - WebSocket Real-time          │
│  - Mobile Responsive    │  - AI Agent Integration         │
├─────────────────────────────────────────────────────────────┤
│  Blockchain Layer                                          │
│  - XRP Ledger Integration  │  - RLUSD Stablecoin          │
│  - Crossmark SDK          │  - Smart Contracts           │
│  - Zero-Knowledge Proofs  │  - Multi-sig Treasury         │
├─────────────────────────────────────────────────────────────┤
│  AI & Analytics                                            │
│  - Challenge Validation   │  - Fraud Detection            │
│  - Data Analysis Agents   │  - Content Moderation         │
│  - Real-time Analytics   │  - Reputation Scoring          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- XRP Ledger testnet account (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Face-to-face-betting.git
cd Face-to-face-betting

# Install dependencies
npm install

# Set up environment variables (see Environment Setup section)
cp .env.example .env

# Start development environment
docker-compose up -d

# Run the application
npm run dev
```

Visit `http://localhost:3000` to see the application running.

---

## 📁 Project Structure

```
playcheck/
├── .taskmaster/              # TaskMaster project management
│   ├── tasks/               # Generated development tasks
│   ├── docs/                # Project documentation
│   └── reports/             # Complexity analysis reports
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── styles/              # Global styles
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── api/             # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Server utilities
│   ├── ai_agent/            # AI processing modules
│   ├── zkp_verification/    # Zero-Knowledge Proof implementation
│   └── eth/                 # Blockchain integration
├── docs/                    # Additional documentation
├── docker-compose.yml       # Local development setup
└── package.json             # Project dependencies
```

---

## 🛠️ Development Workflow

### TaskMaster Integration

This project uses TaskMaster for comprehensive project management and development tracking:

```bash
# View current tasks
npm run tasks:list

# Get next recommended task
npm run tasks:next

# View specific task details
npm run tasks:show <task-id>

# Update task status
npm run tasks:status <task-id> done
```

### Development Process

1. **Check TaskMaster** for the next recommended task
2. **Research** current best practices using TaskMaster's research tools
3. **Implement** the feature following the detailed task breakdown
4. **Test** thoroughly with automated and manual testing
5. **Document** changes and update relevant documentation
6. **Commit** with descriptive messages linked to task IDs

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with the following structure:

```bash
# Application Configuration
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# Database Configuration (Example - Use your preferred setup)
DATABASE_URL=postgresql://username:password@localhost:5432/playcheck
REDIS_URL=redis://localhost:6379

# XRP Ledger Configuration
XRPL_NETWORK=testnet
XRPL_WEBSOCKET_URL=wss://s.altnet.rippletest.net:51233

# AI Services (Optional - for development)
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here

# Security Keys (Generate secure keys for production)
JWT_SECRET=your-super-secure-jwt-secret-here
ENCRYPTION_KEY=your-32-byte-encryption-key-here

# Email Service (Example with SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@playcheck.app

# Analytics & Monitoring
SENTRY_DSN=your-sentry-dsn-here
```

**⚠️ Security Notice**: Never commit real API keys or secrets to version control. Use proper secret management in production.

---

## 🏃‍♂️ Development Scripts

```bash
# Development
npm run dev              # Start development servers
npm run build            # Build for production
npm run test             # Run test suite
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier

# TaskMaster Integration
npm run tasks:init       # Initialize TaskMaster (run once)
npm run tasks:list       # List all tasks
npm run tasks:next       # Get next recommended task
npm run tasks:complexity # Analyze task complexity

# Docker
npm run docker:build     # Build Docker images
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
```

---

## 🧪 Testing Strategy

### Test Categories

1. **Unit Tests**: Component and function-level testing
2. **Integration Tests**: API and service integration testing
3. **E2E Tests**: Full user workflow testing
4. **Security Tests**: Vulnerability and penetration testing
5. **Performance Tests**: Load and stress testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 🔒 Security Best Practices

### For Contributors

- **Never commit secrets**: Use environment variables and `.env.example`
- **Code review required**: All changes must be reviewed
- **Dependency scanning**: Automated security scanning on all dependencies
- **Static analysis**: SonarCloud integration for code quality
- **Penetration testing**: Regular security assessments

### Key Security Features

- 🔐 End-to-end encryption for sensitive data
- 🛡️ Zero-Knowledge Proof implementation for privacy
- 🔑 Multi-signature wallet support for treasury
- 📝 Comprehensive audit logs
- 🚨 Real-time fraud detection
- 🌐 Geographic compliance controls

---

## 🤝 Contributing

We welcome contributions from developers, security researchers, and blockchain enthusiasts!

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Set up** the development environment
4. **Check** TaskMaster for available tasks
5. **Create** a feature branch
6. **Implement** following our coding standards
7. **Test** thoroughly
8. **Submit** a pull request

### Contribution Guidelines

- Follow the TaskMaster workflow for organized development
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure all security checks pass
- Include detailed commit messages with task references

---

## 📚 Documentation

- **API Documentation**: [/docs/api.md](./docs/api.md)
- **Architecture Guide**: [/docs/architecture.md](./docs/architecture.md)
- **Security Guidelines**: [/docs/security.md](./docs/security.md)
- **Deployment Guide**: [/docs/deployment.md](./docs/deployment.md)
- **TaskMaster Workflow**: [/.taskmaster/docs/workflow.md](./.taskmaster/docs/workflow.md)

---

## 🚀 Roadmap

Our development is organized through TaskMaster with 25 major milestones:

### Phase 1: Foundation (Tasks 1-6)

- ✅ Project setup and architecture
- 🔄 Frontend foundation with Next.js
- 🔄 Backend API architecture
- 🔄 Database design and implementation
- 🔄 User authentication system
- 🔄 XRP Ledger integration

### Phase 2: Core Features (Tasks 7-14)

- 🔄 RLUSD stablecoin integration
- 🔄 Real-time communication
- 🔄 Challenge management system
- 🔄 Multi-modal data submission
- 🔄 AI agent system
- 🔄 Zero-Knowledge Proof implementation
- 🔄 Verification and consensus
- 🔄 Reward distribution system

### Phase 3: Advanced Features (Tasks 15-21)

- 🔄 User reputation system
- 🔄 Analytics dashboard
- 🔄 Fundraising platform features
- 🔄 Compliance framework
- 🔄 Marketing and community features
- 🔄 Mobile responsiveness and PWA
- 🔄 Performance optimization

### Phase 4: Production Ready (Tasks 22-25)

- 🔄 Security implementation and auditing
- 🔄 Third-party integrations
- 🔄 Documentation and knowledge base
- 🔄 Deployment and DevOps pipeline

**Track progress**: Use `npm run tasks:list` to see current status

---

## 🏆 Core Features

### For Users

- **Challenge Creation**: Create and validate real-world observation challenges
- **Gamified Verification**: Earn rewards for accurate contributions
- **Privacy Protection**: ZKP-powered verification without revealing data
- **Reputation Building**: Build trust through consistent accuracy
- **RLUSD Rewards**: Earn stablecoin rewards for participation

### For Developers

- **Comprehensive APIs**: Well-documented REST and GraphQL endpoints
- **AI Integration**: Ready-to-use AI agents for validation and analysis
- **Blockchain Tools**: XRP Ledger and RLUSD integration utilities
- **ZKP Framework**: Privacy-preserving verification system
- **Real-time Features**: WebSocket-based live updates

### For Investors

- **Transparent Fundraising**: Open-source, auditable platform
- **Tokenomics Visualization**: Clear economic model documentation
- **Progress Tracking**: Real-time development milestone tracking
- **Security Audits**: Regular third-party security assessments
- **Compliance First**: Built-in regulatory compliance features

---

## 📊 Key Metrics

- **Tasks Completed**: 0/25 major milestones
- **Subtasks**: 300 detailed implementation tasks
- **Test Coverage**: Target 90%+
- **Security Score**: Continuous monitoring
- **Performance**: <3s load time target

---

## 🤝 Community & Support

- **Discord**: [Join our developer community](https://discord.gg/playcheck)
- **Telegram**: [Daily updates and announcements](https://t.me/playcheck)
- **Twitter**: [@PlayCheckApp](https://twitter.com/playcheckapp)
- **Email**: developers@playcheck.app

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚖️ Legal Notice

PlayCheck is designed for educational and demonstration purposes. Always comply with local regulations regarding blockchain applications and fundraising activities. This platform implements robust compliance features but users are responsible for ensuring legal compliance in their jurisdiction.

---

## 🙏 Acknowledgments

- **XRP Ledger** for providing robust blockchain infrastructure
- **Ripple Labs** for RLUSD stablecoin technology
- **TaskMaster AI** for intelligent project management
- **Open Source Community** for the incredible tools and libraries

---

<div align="center">

**Built with ❤️ for the decentralized future**

[Website](https://playcheck.app) • [Documentation](./docs) • [API Reference](./docs/api.md) • [Contributing](./CONTRIBUTING.md)

</div>
