/**
 * Contains API documentation of email-template module
 */

/**
 * @swagger
 * tags:
 *   name: EmailTemplate
 *   description: Email template management
 */

/**
 * @swagger
 * /email-template/all:
 *   get:
 *     summary: List email templates
 *     tags: [EmailTemplate]
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
 *         description: Email templates fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /email-template/single:
 *   get:
 *     summary: Get email template by id
 *     tags: [EmailTemplate]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Email template fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /email-template/create:
 *   post:
 *     summary: Create email template
 *     tags: [EmailTemplate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ticket updated
 *               slug:
 *                 type: string
 *                 example: ticket_updated
 *               subject:
 *                 type: string
 *                 example: Your ticket was updated
 *               body:
 *                 type: string
 *               details:
 *                 type: string
 *               language:
 *                 type: string
 *                 example: en
 *     responses:
 *       200:
 *         description: Email template created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /email-template/update:
 *   put:
 *     summary: Update email template
 *     tags: [EmailTemplate]
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
 *                 example: Ticket updated
 *               slug:
 *                 type: string
 *                 example: ticket_updated
 *               subject:
 *                 type: string
 *                 example: Your ticket was updated
 *               body:
 *                 type: string
 *               details:
 *                 type: string
 *               language:
 *                 type: string
 *                 example: en
 *     responses:
 *       200:
 *         description: Email template updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /email-template/delete:
 *   delete:
 *     summary: Delete email template
 *     tags: [EmailTemplate]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Email template deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /email-template/restore:
 *   post:
 *     summary: Restore deleted email template
 *     tags: [EmailTemplate]
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
 *         description: Email template restored successfully
 *       401:
 *         description: Unauthenticated
 */
