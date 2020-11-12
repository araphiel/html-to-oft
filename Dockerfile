FROM node:lts-alpine
ENV PORT=3000
COPY src .
RUN npm ci
CMD ["npm", "start"]