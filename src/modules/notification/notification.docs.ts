/**
 * Contains API documentation of notification module
 */

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: User notifications
 */

/**
 * @swagger
 * /notification/all:
 *   get:
 *     summary: List notifications for current user
 *     tags: [Notification]
 *     parameters:
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
 *         description: Notifications fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /notification/mark-read:
 *   post:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *                 example: notif-uuid-1
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthenticated
 */
