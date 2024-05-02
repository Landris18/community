FROM node:21-alpine as app
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm && npm ci --silent
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=app /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=app /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
