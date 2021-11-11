FROM node:alpine as builder
WORKDIR '/app'
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
ENV REACT_APP_KEY DxnR8XGXE8CFNRKnTdog9De7HRqHsSSZOrYQoOAaAxhFtMp23J
ENV REACT_APP_API /api
ENV REACT_APP_ODDS_API http://65.0.166.92:3200/api
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
