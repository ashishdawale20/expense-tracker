import { Client, ID, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
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
  },
  createOAuth2Session : (provider, token) => {
    const result = account.createOAuth2Session(provider, token);
    return result;
  },

  createRecovery : (email, recoveryUrl) => {
    const result = account.createRecovery(email, recoveryUrl);
    return result;
  },
  createAccount: (email, password, name) => {
    const result = account.create(email, password, name);
    return result;
  },
  createVerification : (url) => {
    const result = account.createVerification(url);
    return result;
  },
  deleteSessions: () => {
    const result = account.deleteSessions();
    return result;
  },
  getAccount: () => { 
    const result = account.get();
    return result;
  },
  createPhoneSession: (phone_number) => { 
    const result = account.createPhoneSession(ID.unique(), phone_number);
    return result;
  },
  updatePhoneSession: (userID, secret) => { 
    const result = account.updatePhoneSession(userID, secret);
    return result;
  },
  createPhoneVerification: () => { 
    const result = account.createPhoneVerification();
    return result;
  },
  updatePhoneVerification: (userID, secret) => { 
    const result = account.updatePhoneVerification(userID, secret);
    return result;
  },
  CreateEmailVerification: (Url) => {
    return account.createVerification(Url);
  }
};

export default appwriteApi;
