/**
 * Contains API documentation of AI module
 */

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI classify, suggestions, and sentiment
 */

/**
 * @swagger
 * /ai/classify:
 *   post:
 *     summary: Classify ticket text
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Cannot reset password after email change
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Classification result
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ai/suggestions:
 *   post:
 *     summary: Get reply suggestions
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestions generated
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ai/sentiment:
 *   post:
 *     summary: Analyze sentiment
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: I am frustrated with the delayed response
 *     responses:
 *       200:
 *         description: Sentiment analyzed
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ai/status:
 *   get:
 *     summary: Get AI feature status
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI status
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ai/analytics:
 *   get:
 *     summary: Get AI analytics
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI analytics
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ai/settings:
 *   put:
 *     summary: Update AI settings
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *               model:
 *                 type: string
 *                 example: gpt-4o-mini
 *     responses:
 *       200:
 *         description: AI settings updated
 *       401:
 *         description: Unauthenticated
 */
