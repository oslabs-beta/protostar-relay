FROM node:12.18.3
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
CMD npm run test
