FROM nginx:stable-alpine
COPY build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
