
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ 
RUN npm install --omit=dev
COPY cli.js ./
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 8000
CMD ["node", "cli.js"]