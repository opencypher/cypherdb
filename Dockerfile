FROM node:20-bookworm AS build
COPY package.json package-lock.json /home/node/app/
WORKDIR /home/node/app
RUN npm i
COPY . .
RUN npx astro build

FROM httpd:2.4-alpine AS deploy
EXPOSE 80
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /home/node/app/dist .
# Disallow all robots for dev documentation
RUN printf "User-agent: *\nDisallow: /\n" > ./robots.txt
