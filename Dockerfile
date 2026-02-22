# Base image for building the nextjs app, it has node, npm and corepack installed by default.
FROM node:20-alpine

# Switch to this directory i.e working directory inside docker container.
WORKDIR /ypws

# Copy package.json and pnpm-lock.yaml to workdir
COPY package.json pnpm-lock.yaml ./

# To enable pnpm via corepack, because by default in node:20-alpine image only comes with npm & corepack but not with pnpm.

# Install dependencies using pnpm, it will read package.json file and install all the dependencies mentioned in it.
RUN corepack enable && pnpm install

# Copy all the files from current directory to workdir, which are required for building the nextjs app.
COPY . .

# Build the nextjs app. As a result /out directory will be created inside workdir. Only this directory will be passed on to the stage instead of all files from workdir.
RUN pnpm build


# Base image for serving the nextjs app, it has nginx installed by default.
FROM nginx:alpine

# Copy the /out directory from previous stage to nginx's default html directory, so that nginx can serve the nextjs app.
COPY --from=0 /ypws/out /usr/share/nginx/html

# Expose port 80 to access the app via browser.
EXPOSE 80

# Start nginx in foreground to keep the container running.
CMD ["nginx", "-g", "daemon off;"]