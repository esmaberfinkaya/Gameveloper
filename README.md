# Gameveloper

<p align="center">
  <strong>Bridging the Gap Between Gamers and Developers.</strong>
</p>

## Overview

Gameveloper is a specialized ecosystem designed to connect game developers and gamers. The core objective is to help beginner developers understand complex workflows between tools (Unity, Unreal Engine, Blender, etc.), solve fragmented resource problems, and provide rapid solutions to technical issues, thereby increasing overall production capacity. 

Additionally, Gameveloper aims to build an interactive bridge where gamers can comment on their favorite games and developers can discuss the mechanics behind them. The application features a robust **Modular Monolith** architecture, ensuring high performance and a seamless experience.

## Key Features

- **Role-Based Interaction System:** Distinct roles for `GAMER` and `DEVELOPER`. Gamers can provide feedback, while only Developers can provide accepted technical solutions.
- **Trust Score System:** An intricate, community-driven reputation system. Point generation is entirely dependent on community feedback (e.g., earning +25 Trust Score when a solution is officially accepted by an author).
- **Idea Pool (Fikir Havuzu):** A safe space to discuss game mechanics (Story, Visuals, Gameplay) without copyright fears. Features an API-level `isPrivate` mechanism for 1-on-1 confidential mentoring.
- **Dynamic 3-Column Architecture:** A sleek, cyberpunk-inspired UI layout ensuring persistent navigation and live user statistics.
- **Smart Formatting:** Built-in Markdown support with intelligent YouTube iframe rendering for tutorials and roadmaps.

## Technology Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL
- **Design Language:** Cyberpunk aesthetics (Neon Cyan, Accent Purple, Dark Mode)

## Setup & Local Development

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/esmaberfinkaya/Gameveloper.git
   cd Gameveloper
   \`\`\`

2. **Environment Variables:**
   Create a \`.env\` file in the \`backend\` directory and provide your PostgreSQL connection string:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/gameveloper?schema=public"
   \`\`\`

3. **Database Setup:**
   Navigate to the backend directory and push the Prisma schema:
   \`\`\`bash
   cd backend
   npx prisma db push
   \`\`\`

4. **Run Backend Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   *(Server starts on port 5000)*

5. **Run Frontend App:**
   Open a new terminal, navigate to the web directory:
   \`\`\`bash
   cd web
   npm install
   npm run dev
   \`\`\`
   *(App starts on port 3000)*

## Application Architecture

The system utilizes a 3-column UI architecture:
- **Left Column:** Seamless Navigation (Issues, Ideas, Partnerships, Roadmaps).
- **Center Column:** Dynamic Content Feed (Cards with specialized layouts).
- **Right Column:** Persistent User Panel displaying real-time Trust Score and Recent Interactions.

## License
MIT
