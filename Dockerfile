FROM node:18-alpine AS builder
ARG VITE_BASE_URL

ENV VITE_BASE_URL=${VITE_BASE_URL}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80