FROM node:20-alpine     ## Base image for building the nextjs app, it has node, npm and corepack installed by default.
WORKDIR /ypws           ## Switch to this directory i.e working directory inside docker container.
COPY package.json pnpm-lock.yaml ./     ## Copy package.json and pnpm-lock.yaml to workdir
RUN corepack enable     ## To enable pnpm via corepack, because by default in node:20-alpine image only comes with npm & corepack but not with pnpm.
RUN pnpm install        ## Install dependencies using pnpm, it will read package.json file and install all the dependencies mentioned in it.
COPY . .                ## Copy all the files from current directory to workdir, which are required for building the nextjs app.
RUN pnpm build          ## Build the nextjs app. As a result /out directory will be created inside workdir. Only this directory will be passed on to the stage instead of all files from workdir.

FROM nginx:alpine       ## Base image for serving the nextjs app, it has nginx installed by default.
COPY --from=0 /ypws/out /usr/share/nginx/html       ## Copy the /out directory from previous stage to nginx's default html directory, so that nginx can run the nextjs app.
EXPOSE 80                                           ## Expose port 80 to access the app via browser.
CMD ["nginx", "-g", "daemon off;"]                  ## Start nginx in foreground to keep the container running.