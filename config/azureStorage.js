const { BlobServiceClient } = require('@azure/storage-blob');

let containerClient;

const getContainerClient = () => {
	if (containerClient) return containerClient;
	if (!process.env.AZURE_STORAGE_CONNECTION_STRING || !process.env.AZURE_STORAGE_CONTAINER_NAME) {
		throw new Error('Azure storage is not configured');
	}
	const blobServiceClient = BlobServiceClient.fromConnectionString(
		process.env.AZURE_STORAGE_CONNECTION_STRING
	);
	containerClient = blobServiceClient.getContainerClient(
		process.env.AZURE_STORAGE_CONTAINER_NAME
	);
	return containerClient;
};

const uploadToAzure = async (fileBuffer, mimeType, folder) => {
	const { v4: uuidv4 } = require('uuid');
	const ext = mimeType.split('/')[1] || 'jpg';
	const blobName = `${folder}/${uuidv4()}.${ext}`;
	const blockBlobClient = getContainerClient().getBlockBlobClient(blobName);
	await blockBlobClient.uploadData(fileBuffer, {
		blobHTTPHeaders: { blobContentType: mimeType }
	});
	return blockBlobClient.url;
};

module.exports = {
	get containerClient() {
		return getContainerClient();
	},
	uploadToAzure
};
