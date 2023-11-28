###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running pnpm install on every code change.
COPY --chown=user:group package*.json ./

# Install app dependencies using the `pnpm i` command with the `--no-frozen-lockfile` flag.
RUN pnpm i --no-frozen-lockfile

# Bundle app source
COPY --chown=user:group . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --chown=user:group package*.json ./

# In order to run `pnpm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `pnpm i --no-frozen-lockfile` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=user:group --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=user:group . .

# Run the build command which creates the production bundle
RUN pnpm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN pnpm install --prod && pnpm store prune

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=user:group --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=user:group --from=build /usr/src/app/dist ./dist

# Start the server in production mode
CMD ["pnpm", "start:prod"]