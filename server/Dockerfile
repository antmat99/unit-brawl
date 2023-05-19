FROM alpine:latest

RUN apk update
RUN apk add git
RUN apk add --update nodejs npm
RUN apk add maven
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
