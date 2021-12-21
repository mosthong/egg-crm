FROM registry-vpc.cn-shenzhen.aliyuncs.com/jp-develop/nginx:qym
ENV LANG C.UTF-8
ENV APP_HOME /usr/share/nginx/html/

RUN rm -rf /etc/nginx/conf.d/*.conf
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist/ $APP_HOME
