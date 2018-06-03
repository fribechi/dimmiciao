FROM node:boron-wheezy

# Create app directory

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN apt-get clean && apt-get update -qqy \
  && apt-get upgrade -y openssl curl

# Bundle app source
COPY . /usr/src/app
#COPY package.json /usr/src/app/
RUN npm install
#RUN npm rebuild

EXPOSE 8080

CMD [ "nodejs", "app.js" ]