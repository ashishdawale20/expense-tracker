import { Client, ID, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://appwrite.vhaash-yacht-booking-test.in/v1")
  .setProject("653e4b682fe37ac82948");
const databases = new Databases(client);
const account = new Account(client);

let appwriteApi = {
  createDocument: (databaseId, collectionId, document) => {
    const result = databases.createDocument(databaseId, collectionId,  ID.unique(), document);
    return result;
  },
  createEmailSession : (email, password) => {
    const result = account.createEmailSession(email, password);
    return result;
  }

};

export default appwriteApi;