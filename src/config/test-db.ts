// Set up a test environment configuration
import { PrismaClient } from "../generated/client";
import {execSync} from "child_process";
import {join} from "path";
import {URL} from "url";
import {v4 as uuid} from "uuid";

// Setup unique schema for test database
const generateTestDatabaseUrl = (url: string) => {
    const dbUrl = new URL(url);
    dbUrl.searchParams.set("schema", `test-${uuid()}`);
    return dbUrl.toString();
};

// Create a dedicated PrismaClient for testing
const prismaTestClient = new PrismaClient({
    datasources: {
        db: {
            url: generateTestDatabaseUrl(process.env.DATABASE_URL || ''),
        },
    },
});

// Setup and teardown for tests
const setupTestDatabase = async () => {
    // Push the schema to the test database
    const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');
    execSync(`${prismaBinary} db push --skip-generate`, {
        env: {
            ...process.env,
            DATABASE_URL: prismaTestClient.$connect.name,
        },
    });

    return prismaTestClient;
};

// Clean up the test database
const teardownTestDatabase = async () => {
    await prismaTestClient.$disconnect();
};

export { setupTestDatabase, teardownTestDatabase, prismaTestClient };