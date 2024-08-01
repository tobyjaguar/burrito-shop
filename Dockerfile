FROM node:18
WORKDIR /app
COPY . .
RUN yarn && yarn add typescript tsc
CMD ["yarn", "start"]