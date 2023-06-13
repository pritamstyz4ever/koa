const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const sanitizeFilename = require('sanitize-filename');
const { putFile } = require('../controllers/storeService');

// Helper function to generate a random file name with extension
const generateRandomFileName = (mimeType) => {
  const uniqueId = uuidv4();
  const extension = mime.extension(mimeType);
  return `${uniqueId}.${extension}`;
};
/**
 * @swagger
 * /client/{clientId}/upload:
 *   post:
 *     tags:
 *       - client
 *     summary: Uploads an File for a client
 *     description: Uploads an File for the specified client.
 *     operationId: uploadFile
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: clientId
 *         in: path
 *         description: ID of the client to upload the file for
 *         required: false
 *         type: integer
 *         format: int64
 *       - name: file
 *         in: formData
 *         description: File to upload
 *         required: false
 *         type: file
 *       - name: token
 *         in: header
 *         description: Auth Jwt token
 *         required: false
 *         type: string
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/UploadResponse'
 *     security:
 *       - BearerAuth: []
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT   
 * definitions:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *           description: Response code
 *         type:
 *           type: string
 *           description: Type of response
 *         message:
 *           type: string
 *           description: Response message
 */

module.exports = (router) => {
  router.post('/client/{clientId}/upload', async (ctx) => {
    const file = ctx.request.file;
    const clientId = ctx.params.clientId;

    try {
      if (!file) {
        ctx.throw(400, 'No file uploaded');
      }
      // Check file size
      const maxSizeInBytes = 5 * 1024 * 1024 * 1024;; // 5GB
      if (file.size > maxSizeInBytes) {
        ctx.throw(400, 'File size exceeds the maximum limit');
      }

      // Validate Content-Type
      const allowedMimeTypes = ['text/csv'];
      const fileBuffer = file.buffer;
      const detectedFileType = await fileType.fromBuffer(fileBuffer);

      if (!detectedFileType || !allowedMimeTypes.includes(detectedFileType.mime)) {
        ctx.throw(400, 'Invalid file type. Only CSV files are allowed.');
      }

      // Sanitize file name
      const sanitizedFileName = sanitizeFilename(file.originalname);

      const randomFileName = generateRandomFileName(mimeType);
      const key = `${clientId}/${randomFileName}`;

      const fileUrl = await putFile(key, fileBuffer, sanitizedFileName);

      ctx.body = `File uploaded successfully at ${fileUrl}`;
    } catch (err) {
      console.log(err);
      ctx.body = 'There was an error while uploading your file';
    }
  });
};

