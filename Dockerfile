FROM node:latest

# Only needed for running from image
# Remember enable shared drivers

# ADD package.json /tmp/package.json
# RUN cd /tmp && npm install
# RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
# ADD . /opt/app

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "start"]