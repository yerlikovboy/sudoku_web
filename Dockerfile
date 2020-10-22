FROM node:14-alpine as build-step 
RUN mkdir /app 
WORKDIR /app 
COPY package.json .
RUN npm install 
COPY src ./src/
COPY public ./public/
RUN npm run build 

FROM nginx:1.19.2-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
