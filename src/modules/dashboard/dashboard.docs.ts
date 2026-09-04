/**
 * Contains API documentation of dashboard module
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard metrics and analytics
 */

/**
 * @swagger
 * /dashboard/metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Metrics fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /dashboard/analytics:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /dashboard/performance:
 *   get:
 *     summary: Get dashboard performance
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Performance fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /dashboard/charts:
 *   get:
 *     summary: Get dashboard chart data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Charts fetched successfully
 *       401:
 *         description: Unauthenticated
 */
