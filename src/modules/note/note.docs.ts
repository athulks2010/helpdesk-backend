/**
 * Contains API documentation of note module
 */

/**
 * @swagger
 * tags:
 *   name: Note
 *   description: Note management
 */

/**
 * @swagger
 * /note/all:
 *   get:
 *     summary: List notes
 *     tags: [Note]
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
 *         description: Notes fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /note/single:
 *   get:
 *     summary: Get note by id
 *     tags: [Note]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Note fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /note/create:
 *   post:
 *     summary: Create note
 *     tags: [Note]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Follow up with client
 *               details:
 *                 type: string
 *                 example: Call tomorrow at 10 AM about the open ticket.
 *               color:
 *                 type: string
 *                 example: "#3B82F6"
 *               user_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Note created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /note/update:
 *   put:
 *     summary: Update note
 *     tags: [Note]
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
 *                 example: Follow up with client
 *               details:
 *                 type: string
 *                 example: Call tomorrow at 10 AM about the open ticket.
 *               color:
 *                 type: string
 *                 example: "#3B82F6"
 *               user_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /note/delete:
 *   delete:
 *     summary: Delete note
 *     tags: [Note]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /note/restore:
 *   post:
 *     summary: Restore deleted note
 *     tags: [Note]
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
 *         description: Note restored successfully
 *       401:
 *         description: Unauthenticated
 */
