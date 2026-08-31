# MCP server, stdio transport. Built for directory checks (Glama) and for
# anyone who would rather run the server in a container than install Node.
FROM node:22-alpine AS build
WORKDIR /app
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci
COPY mcp/tsconfig.json ./
COPY mcp/src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# stdio server: the client speaks JSON-RPC on stdin/stdout.
ENTRYPOINT ["node", "dist/index.js"]
