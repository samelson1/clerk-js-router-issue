# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune --scope=ui-compare --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm i -g turbo
RUN npm install -D --arch=x64 --platform=linux turbo --force
#RUN npm install -D --arch=arm64 --platform=darwin turbo --force
#RUN npm install --force


# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY .env.production .env.production

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN turbo run build --filter=ui-compare...

FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/ui-compare/next.config.js .
COPY --from=installer /app/apps/ui-compare/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui-compare/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui-compare/.next/static ./apps/ui-compare/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui-compare/public ./apps/ui-compare/public

CMD node apps/ui-compare/server.js
