/**
 * Contains API documentation of type module
 */

/**
 * @swagger
 * tags:
 *   name: Type
 *   description: Type management
 */

/**
 * @swagger
 * /type/all:
 *   get:
 *     summary: List types
 *     tags: [Type]
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
 *         description: Types fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /type/single:
 *   get:
 *     summary: Get type by id
 *     tags: [Type]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Type fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /type/create:
 *   post:
 *     summary: Create type
 *     tags: [Type]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bug Report
 *               slug:
 *                 type: string
 *                 example: bug-report
 *     responses:
 *       200:
 *         description: Type created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /type/update:
 *   put:
 *     summary: Update type
 *     tags: [Type]
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
 *                 example: Bug Report
 *               slug:
 *                 type: string
 *                 example: bug-report
 *     responses:
 *       200:
 *         description: Type updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /type/delete:
 *   delete:
 *     summary: Delete type
 *     tags: [Type]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Type deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /type/restore:
 *   post:
 *     summary: Restore deleted type
 *     tags: [Type]
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
 *         description: Type restored successfully
 *       401:
 *         description: Unauthenticated
 */
