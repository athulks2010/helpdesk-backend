/**
 * Contains API documentation of public module
 */

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Public landing, open ticket, and chat APIs (no auth)
 */

/**
 * @swagger
 * /public/faqs:
 *   get:
 *     summary: List public FAQs
 *     tags: [Public]
 *     security: []
 *     responses:
 *       200:
 *         description: FAQs fetched successfully
 */

/**
 * @swagger
 * /public/posts:
 *   get:
 *     summary: List public posts
 *     tags: [Public]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *           example: 15
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 */

/**
 * @swagger
 * /public/posts/single:
 *   get:
 *     summary: Get public post by id or slug
 *     tags: [Public]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post fetched successfully
 */

/**
 * @swagger
 * /public/knowledge-base:
 *   get:
 *     summary: List public knowledge base articles
 *     tags: [Public]
 *     security: []
 *     responses:
 *       200:
 *         description: Knowledge base fetched successfully
 */

/**
 * @swagger
 * /public/services:
 *   get:
 *     summary: List public services
 *     tags: [Public]
 *     security: []
 *     responses:
 *       200:
 *         description: Services fetched successfully
 */

/**
 * @swagger
 * /public/front-page:
 *   get:
 *     summary: Get public front page by slug
 *     tags: [Public]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *           example: home
 *     responses:
 *       200:
 *         description: Front page fetched successfully
 */

/**
 * @swagger
 * /public/ticket/open:
 *   post:
 *     summary: Open a public support ticket
 *     tags: [Public]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject]
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Need help with billing
 *               body:
 *                 type: string
 *               message:
 *                 type: string
 *               status_id:
 *                 type: number
 *               priority_id:
 *                 type: number
 *               department_id:
 *                 type: number
 *               category_id:
 *                 type: number
 *               type_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ticket opened
 */

/**
 * @swagger
 * /public/subscribe/news:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Public]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: guest@example.com
 *     responses:
 *       200:
 *         description: Subscribed
 */

/**
 * @swagger
 * /public/chat/init:
 *   post:
 *     summary: Initialize public chat conversation
 *     tags: [Public]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: guest@example.com
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat initialized
 */

/**
 * @swagger
 * /public/chat/conversation:
 *   get:
 *     summary: Get public chat conversation with messages
 *     tags: [Public]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Conversation fetched
 */

/**
 * @swagger
 * /public/chat/send-message:
 *   post:
 *     summary: Send public chat message
 *     tags: [Public]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversation_id, message]
 *             properties:
 *               conversation_id:
 *                 type: number
 *               contact_id:
 *                 type: number
 *               message:
 *                 type: string
 *                 example: Hello, I need help
 *     responses:
 *       200:
 *         description: Message sent
 */
