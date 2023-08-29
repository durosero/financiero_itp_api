# Install dependencies only when needed
FROM node:18.12.1 AS deps

RUN mkdir -p /app
WORKDIR /app

# Configure timezone
ENV TZ=America/Bogota
ENV NODE_ENV=dev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package.json tsconfig.json tsconfig.build.json .env /app/
RUN npm install



# Build the app with cache dependencies
FROM node:18.12.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps .env .
COPY . .
RUN npm run build
RUN npm run copy:templates





# Production image, copy all the files and run next
FROM node:18.12.1 AS runner

# Set working directory
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist


CMD [ "node","dist/main" ]