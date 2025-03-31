FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Copy the entire project into the container
COPY . .

EXPOSE 4200

CMD ["npm", "start"]
