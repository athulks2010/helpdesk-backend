/**
 * Contains API documentation of report module
 */

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Report generation
 */

/**
 * @swagger
 * /report/generate:
 *   post:
 *     summary: Generate report
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: ticket_summary
 *               status_id:
 *                 type: number
 *               department_id:
 *                 type: number
 *               from:
 *                 type: string
 *                 format: date-time
 *               to:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /report/show:
 *   get:
 *     summary: Show report
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: ticket_summary
 *       - in: query
 *         name: status_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Report fetched successfully
 *       401:
 *         description: Unauthenticated
 */
