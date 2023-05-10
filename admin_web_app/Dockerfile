FROM node:latest
WORKDIR /admin_frontend
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_SERVER_URL=http://localhost:3001
EXPOSE 3000
CMD ["npm", "start"]
