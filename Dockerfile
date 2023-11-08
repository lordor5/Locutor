FROM node:latest
WORKDIR /bot
COPY . /bot
RUN npm install
CMD ["node","index.js"]