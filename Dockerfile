FROM node:lts-alpine
RUN npm ci
CMD ["npm", "start"]