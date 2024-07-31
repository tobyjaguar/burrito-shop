FROM node:18
WORKDIR /app
COPY "package.json" .
# RUN yarn install --production
COPY . .
RUN yarn && yarn add typescript tsc && yarn build
CMD ["node", "./dist/index.js"]