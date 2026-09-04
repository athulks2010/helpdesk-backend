/**
 * Contains API documentation of file-upload module
 */

/**
 * @swagger
 * tags:
 *   name: FileUpload
 *   description: File upload management
 */

/**
 * @swagger
 * /file-upload/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [FileUpload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Name of the folder to save the file in
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /file-upload/list:
 *   get:
 *     summary: List uploaded files
 *     tags: [FileUpload]
 *     responses:
 *       200:
 *         description: Files listed successfully
 *       401:
 *         description: Unauthenticated
 */
