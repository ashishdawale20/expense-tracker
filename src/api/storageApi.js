import { Client, ID, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);
const storage = new Storage(client);
const truckImageBucketId = process.env.REACT_APP_APPWRITE_STORAGE_TRUCK_IMAGES_ID;

let storageApi = {
  getFile: (bucketId,fileId) => {
    const result = storage.getFilePreview(bucketId, fileId);
    return result.href;
  },

  deleteFile: (fileId) => {
    const promise = storage.deleteFile(truckImageBucketId, fileId);
    return promise;
  },

  listFiles: () => {
    return storage.listFiles(truckImageBucketId);
  },

  uploadFile: (bucketId,File) => {
    return storage.createFile(bucketId, ID.unique(), File);
  },

};

export default storageApi;