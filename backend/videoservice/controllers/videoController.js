import { BlobServiceClient } from "@azure/storage-blob";
import Video from "../models/Video.js";
import { azureStorageConnection } from "../app.js";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No video file uploaded.");

    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnection);
    const containerClient = blobServiceClient.getContainerClient("videos");
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(req.file.buffer, { blobHTTPHeaders: { blobContentType: req.file.mimetype } });

    const video = new Video({ filename: blobName, url: blockBlobClient.url });
    await video.save();

    res.status(200).json({ message: "✅ Video uploaded successfully!", url: blockBlobClient.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading video" });
  }
};

export const listVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching videos" });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnection);
    const containerClient = blobServiceClient.getContainerClient("videos");
    const blockBlobClient = containerClient.getBlockBlobClient(req.params.filename);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Error streaming video" });
  }
};
