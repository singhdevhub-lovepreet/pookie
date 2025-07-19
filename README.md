# Minecraft-like Game Lobby

A 3D multiplayer game lobby built with React, TypeScript, Three.js, and Socket.IO. This project provides a Minecraft-inspired environment where players can join, move around, and communicate with each other.

## Features

- 3D environment with terrain, trees, water, and houses
- Player representation with name and country flag
- Real-time movement and position updates
- Voice chat capability between players
- Session management for player joining/leaving
- Idle detection with automatic kick after 5 minutes
- Login screen for name and country selection

## Technologies Used

- React with TypeScript
- Three.js for 3D rendering
- Socket.IO for real-time communication
- React Three Fiber & Drei for Three.js React integration
- Object-oriented programming approach

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd game-lobby
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Backend Setup

This project requires a backend server using Java NIO sockets for communication. The backend implementation is not included in this repository as per requirements. You'll need to implement:

1. A Java NIO server that can:
   - Handle player connections
   - Broadcast player positions and activities
   - Manage audio data transmission
   - Track player idle status

2. Server endpoints:
   - `/joinLobby` - For player registration
   - `/leaveLobby` - For player disconnection
   - `/updatePosition` - For position updates
   - `/startSpeaking` & `/stopSpeaking` - For audio control
   - `/audioData` - For transmitting audio data

## Project Structure

```
src/
├── assets/            # Static assets and resources
├── components/        # React components
│   ├── game/          # Game-related components
│   └── ui/            # User interface components
├── models/            # TypeScript class models
├── services/          # Service classes
└── hooks/             # Custom React hooks
```

## Usage

1. Start the application
2. Enter your name and select your country
3. Grant audio permission when prompted
4. Use WASD or arrow keys to move around the environment
5. Press and hold a key (e.g., spacebar) to speak

## Known Issues and Limitations

- Textures need to be added to the public/textures directory
- Audio implementation requires backend integration
- Player models are currently represented as simple boxes

## Future Improvements

- Add more detailed player models
- Implement chat functionality
- Add more interactive elements in the environment
- Support for mobile devices
- Enhance graphics and visual effects

## License

This project is licensed under the MIT License - see the LICENSE file for details.