# Build stage: Vite app (VITE_* env baked in at build time)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_GRAPHQL_URI=http://localhost:3010/api/v1/user
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI
RUN npm run build

# Serve stage: static files via nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
