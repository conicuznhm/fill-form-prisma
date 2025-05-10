# Use a lightweight Node base image
FROM node:24-alpine

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN pnpm prisma generate

# Copy the rest of your application code
COPY . .

# Build your application
RUN pnpm run build

# Copy the entrypoint script
COPY entrypoint.sh .

# Make the entrypoint script executable 
# (necessary when using windows to build the image, if linux just chmod +x entrypoint.sh before build image)
RUN chmod +x entrypoint.sh

# Expose the port your app will run on
EXPOSE 8899

# Run the entrypoint script which handles migrations by ENTRYPOINT and starts the server by CMD
ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["pnpm", "start"]



# //for build and run api
# podman build -t form-api:v1 .
# podman build -t form-api:v1 --no-cache .
# podman run --name form-api --env-file .env.local -p 8899:8899 -d form-api:v1
# podman run --name form-api --env-file .env.local --network my-network -p 8899:8899 -d form-api:v1


# podman run --name from-api \
#  -e DATABASE_URL=postgresql://postgres:password@10.88.0.35:5432/form_db \
#  -e PORT=8899 \
#  -p 8899:8899 \
#  -d form-api:v1

# podman run --name from-api \
#  -e DATABASE_URL=postgresql://postgres:password@10.88.0.35:5432/form_db \
#  -e PORT=8899 \
#  --network my-network \
#  -p 8899:8899 \
#  -d form-api:v1