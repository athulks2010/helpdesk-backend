/**
 * Contains API documentation of faq module
 */

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: FAQ management
 */

/**
 * @swagger
 * /faq/all:
 *   get:
 *     summary: List faqs
 *     tags: [FAQ]
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
 *         description: FAQs fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /faq/single:
 *   get:
 *     summary: Get faq by id
 *     tags: [FAQ]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: FAQ fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /faq/create:
 *   post:
 *     summary: Create faq
 *     tags: [FAQ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, details]
 *             properties:
 *               name:
 *                 type: string
 *                 example: How do I reset my password?
 *               details:
 *                 type: string
 *                 example: Open the login page, click Forgot Password, and follow the email link.
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: FAQ created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /faq/update:
 *   put:
 *     summary: Update faq
 *     tags: [FAQ]
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
 *                 example: How do I reset my password?
 *               details:
 *                 type: string
 *                 example: Open the login page, click Forgot Password, and follow the email link.
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /faq/delete:
 *   delete:
 *     summary: Delete faq
 *     tags: [FAQ]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /faq/restore:
 *   post:
 *     summary: Restore deleted faq
 *     tags: [FAQ]
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
 *         description: FAQ restored successfully
 *       401:
 *         description: Unauthenticated
 */
