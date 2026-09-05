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

/**
 * @swagger
 * /language/translations:
 *   get:
 *     summary: Get translations and phrase list for a language
 *     tags: [Language]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           example: cn
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Translations fetched successfully
 */

/**
 * @swagger
 * /language/phrase:
 *   post:
 *     summary: Add a new translation phrase (title and value pair)
 *     tags: [Language]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: cn
 *               key:
 *                 type: string
 *                 example: Submit Ticket
 *               value:
 *                 type: string
 *                 example: 提交工单
 *     responses:
 *       200:
 *         description: Phrase added successfully
 *       400:
 *         description: Validation error
 *   put:
 *     summary: Update translation phrase value (single phrase or bulk list)
 *     tags: [Language]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: cn
 *               key:
 *                 type: string
 *                 example: Submit Ticket
 *               value:
 *                 type: string
 *                 example: 提交新工单
 *               language_values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       200:
 *         description: Phrase updated successfully
 *   delete:
 *     summary: Delete a translation phrase
 *     tags: [Language]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           example: cn
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           example: Submit Ticket
 *     responses:
 *       200:
 *         description: Phrase deleted successfully
 */

