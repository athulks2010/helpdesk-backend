/**
 * Contains API documentation of status module
 */

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Status management
 */

/**
 * @swagger
 * /status/all:
 *   get:
 *     summary: List statuses
 *     tags: [Status]
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
 *         description: Statuses fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /status/single:
 *   get:
 *     summary: Get status by id
 *     tags: [Status]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Status fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /status/create:
 *   post:
 *     summary: Create status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Open
 *               slug:
 *                 type: string
 *                 example: open
 *               color:
 *                 type: string
 *                 example: '#22c55e'
 *     responses:
 *       200:
 *         description: Status created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /status/update:
 *   put:
 *     summary: Update status
 *     tags: [Status]
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
 *                 example: Open
 *               slug:
 *                 type: string
 *                 example: open
 *               color:
 *                 type: string
 *                 example: '#22c55e'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /status/delete:
 *   delete:
 *     summary: Delete status
 *     tags: [Status]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Status deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /status/restore:
 *   post:
 *     summary: Restore deleted status
 *     tags: [Status]
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
 *         description: Status restored successfully
 *       401:
 *         description: Unauthenticated
 */
