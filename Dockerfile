FROM node:lts-alpine
ENV PORT=8080
COPY src .
RUN npm ci
CMD ["npm", "start"]