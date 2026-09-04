/**
 * Contains API documentation of setting module
 */

/**
 * @swagger
 * tags:
 *   name: Setting
 *   description: Setting management
 */

/**
 * @swagger
 * /setting/all:
 *   get:
 *     summary: List settings
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *           example: 15
 *     responses:
 *       200:
 *         description: Settings fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/single:
 *   get:
 *     summary: Get setting by id
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Setting fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/by-slug:
 *   get:
 *     summary: Get setting value/object by slug
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: app_name
 *     responses:
 *       200:
 *         description: Setting fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/create:
 *   post:
 *     summary: Create setting
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: App Name
 *               slug:
 *                 type: string
 *                 example: app_name
 *               type:
 *                 type: string
 *                 example: text
 *               value:
 *                 type: string
 *                 example: Help Desk
 *     responses:
 *       200:
 *         description: Setting created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/update:
 *   put:
 *     summary: Update setting
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *                 example: App Name
 *               slug:
 *                 type: string
 *                 example: app_name
 *               type:
 *                 type: string
 *                 example: text
 *               value:
 *                 type: string
 *                 example: Help Desk
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/delete:
 *   delete:
 *     summary: Delete setting
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Setting deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/restore:
 *   post:
 *     summary: Restore deleted setting
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Setting restored successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/smtp:
 *   get:
 *     summary: Get SMTP settings
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: SMTP settings fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/smtp/update:
 *   post:
 *     summary: Update SMTP settings
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               mail_host: "smtp.gmail.com"
 *               mail_port: "587"
 *               mail_username: "user@gmail.com"
 *               mail_password: "password"
 *               mail_encryption: "ssl"
 *               mail_from_address: "user@gmail.com"
 *               mail_from_name: "HelpDesk"
 *     responses:
 *       200:
 *         description: SMTP settings updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/pusher:
 *   get:
 *     summary: Get Pusher settings
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: Pusher settings fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/pusher/update:
 *   post:
 *     summary: Update Pusher settings
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               pusher_app_id: "2190018"
 *               pusher_app_key: "your-app-key"
 *               pusher_app_secret: "your-app-secret"
 *               pusher_app_cluster: "ap2"
 *     responses:
 *       200:
 *         description: Pusher settings updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/email-piping:
 *   get:
 *     summary: Get Email Piping (IMAP) settings
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: Email piping settings fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/email-piping/update:
 *   post:
 *     summary: Update Email Piping (IMAP) settings
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               enable_email_piping: "true"
 *               imap_host: "imap.gmail.com"
 *               imap_port: "993"
 *               imap_protocol: "imap"
 *               imap_encryption: "ssl"
 *               imap_username: "user@gmail.com"
 *               imap_password: "password"
 *     responses:
 *       200:
 *         description: Email piping settings updated successfully
 *       401:
 *         description: Unauthenticated
 */


