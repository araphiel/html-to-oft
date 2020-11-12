FROM node:lts-alpine
COPY src .
RUN npm ci
CMD ["npm", "start"]