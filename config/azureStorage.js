const { BlobServiceClient } = require('@azure/storage-blob');

const blobServiceClient = BlobServiceClient.fromConnectionString(
	process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
	process.env.AZURE_STORAGE_CONTAINER_NAME
);

const uploadToAzure = async (fileBuffer, mimeType, folder) => {
	const { v4: uuidv4 } = require('uuid');
	const ext = mimeType.split('/')[1] || 'jpg';
	const blobName = `${folder}/${uuidv4()}.${ext}`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);
	await blockBlobClient.uploadData(fileBuffer, {
		blobHTTPHeaders: { blobContentType: mimeType }
	});
	return blockBlobClient.url;
};

module.exports = { containerClient, uploadToAzure };
