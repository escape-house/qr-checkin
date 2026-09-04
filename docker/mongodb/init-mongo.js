const appUsername = process.env.MONGO_APP_USERNAME;
const appPassword = process.env.MONGO_APP_PASSWORD;
const databaseName = process.env.MONGO_DATABASE;

if (!databaseName) throw new Error("MONGO_DATABASE is missing");
if (!appUsername) throw new Error("MONGO_APP_USERNAME is missing");
if (!appPassword) throw new Error("MONGO_APP_PASSWORD is missing");

db.getSiblingDB(databaseName).createUser({
    user: appUsername,
    pwd: appPassword,
    roles: [{ role: "readWrite", db: databaseName }]
});
