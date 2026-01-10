import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://syd.cloud.appwrite.io/v1")
    .setProject("696198610027d564e8a1");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };