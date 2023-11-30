FROM node:21.2.0-alpine AS base
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:21.2.0-alpine AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build \
    && rm -rf node_modules \
    && npm install --omit=dev

FROM node:21.2.0-alpine AS prod
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]