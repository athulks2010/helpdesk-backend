/**
 * Contains API documentation of language module
 */

/**
 * @swagger
 * tags:
 *   name: Language
 *   description: Language management
 */

/**
 * @swagger
 * /language/all:
 *   get:
 *     summary: List languages
 *     tags: [Language]
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
 *         description: Languages fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /language/single:
 *   get:
 *     summary: Get language by id
 *     tags: [Language]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Language fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /language/create:
 *   post:
 *     summary: Create language
 *     tags: [Language]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: English
 *               code:
 *                 type: string
 *                 example: en
 *               flag:
 *                 type: string
 *                 example: us
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Language created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /language/update:
 *   put:
 *     summary: Update language
 *     tags: [Language]
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
 *                 example: English
 *               code:
 *                 type: string
 *                 example: en
 *               flag:
 *                 type: string
 *                 example: us
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /language/delete:
 *   delete:
 *     summary: Delete language
 *     tags: [Language]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /language/restore:
 *   post:
 *     summary: Restore deleted language
 *     tags: [Language]
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
 *         description: Language restored successfully
 *       401:
 *         description: Unauthenticated
 */
