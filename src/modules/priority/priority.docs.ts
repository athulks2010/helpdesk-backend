/**
 * Contains API documentation of priority module
 */

/**
 * @swagger
 * tags:
 *   name: Priority
 *   description: Priority management
 */

/**
 * @swagger
 * /priority/all:
 *   get:
 *     summary: List priorities
 *     tags: [Priority]
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
 *         description: Priorities fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /priority/single:
 *   get:
 *     summary: Get priority by id
 *     tags: [Priority]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Priority fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /priority/create:
 *   post:
 *     summary: Create priority
 *     tags: [Priority]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: High
 *               color:
 *                 type: string
 *                 example: '#ef4444'
 *     responses:
 *       200:
 *         description: Priority created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /priority/update:
 *   put:
 *     summary: Update priority
 *     tags: [Priority]
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
 *                 example: High
 *               color:
 *                 type: string
 *                 example: '#ef4444'
 *     responses:
 *       200:
 *         description: Priority updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /priority/delete:
 *   delete:
 *     summary: Delete priority
 *     tags: [Priority]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Priority deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /priority/restore:
 *   post:
 *     summary: Restore deleted priority
 *     tags: [Priority]
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
 *         description: Priority restored successfully
 *       401:
 *         description: Unauthenticated
 */
