# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /app
HEALTHCHECK NONE

# 1️⃣  Copy only dependency manifests first (keeps layer cache efficient)
COPY package*.json ./

# 2️⃣  Install deps *without* running any scripts ➜ skips the automatic `prepare`
RUN npm ci --ignore-scripts            # dev + prod deps, no build yet

# 3️⃣  Now bring in the full source tree (tsconfig.json, src/, …)
COPY . .

# 4️⃣  Build explicitly – everything is present now
RUN npm run build

# 5️⃣  Strip dev-dependencies; keeps runtime small
RUN npm prune --omit=dev

# Stage 2: Create the production image
FROM node:20-slim

WORKDIR /app

# 6️⃣  Copy ready-to-run artefacts from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set executable permissions for the binary
RUN chmod +x build/index.js

# Expose the port the app runs on
EXPOSE 8000

# Set the entrypoint to run the MCP server
CMD ["node", "build/index.js"]
