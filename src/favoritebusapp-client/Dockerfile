FROM node:24-slim AS build

WORKDIR /app

COPY src/favoritebusapp-client/package.json package.json
COPY src/favoritebusapp-client/package-lock.json package-lock.json

RUN npm install

COPY src/favoritebusapp-client .

RUN npm run build --loglevel=error

FROM nginx:alpine

COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
