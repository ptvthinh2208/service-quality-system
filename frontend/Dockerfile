# Stage 1: Build Image
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json và lock files
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve Image
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Xóa các tệp mặc định của nginx
RUN rm -rf ./*

# Copy kết quả build từ stage trước (Theo angular.json outputPath là "dist")
COPY --from=build /app/dist .

# Copy cấu hình nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
