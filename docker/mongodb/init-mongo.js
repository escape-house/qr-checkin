const databaseName = process.env.MONGO_DATABASE;
const appUsername = process.env.MONGO_APP_USERNAME;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!databaseName) {
    throw new Error("MONGO_DATABASE is missing");
}

if (!appUsername) {
    throw new Error("MONGO_APP_USERNAME is missing");
}

if (!appPassword) {
    throw new Error("MONGO_APP_PASSWORD is missing");
}

const applicationDatabase = db.getSiblingDB(databaseName);

applicationDatabase.createUser({
    user: appUsername,
    pwd: appPassword,
    roles: [
        {
            role: "readWrite",
            db: databaseName
        }
    ]
});

applicationDatabase.createCollection("declarationsOfConsent");

applicationDatabase.declarationsOfConsent.createIndex({
    slotId: 1
});

applicationDatabase.declarationsOfConsent.createIndex({
    lastName: 1
});

applicationDatabase.declarationsOfConsent.createIndex({
    createdAt: -1
});