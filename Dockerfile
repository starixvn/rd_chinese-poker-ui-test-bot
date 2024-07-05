FROM hub.lumigame.com/docker-hub/library/node:lts-alpine AS base
WORKDIR /app
COPY package.json .
RUN npm install 

FROM hub.lumigame.com/docker-hub/library/node:lts-alpine AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /root/.npm /root/.npm
COPY . .
RUN npm run build \
    && rm -rf node_modules \
    && npm install --omit=dev

FROM hub.lumigame.com/docker-hub/library/node:lts-alpine AS prod
WORKDIR /app

ENV NEXT_SHARP_PATH=/app/node_modules/sharp
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]