/**
 * Contains API documentation of conversation module
 */

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation and messaging
 */

/**
 * @swagger
 * /conversation/all:
 *   get:
 *     summary: List conversations
 *     tags: [Conversation]
 *     parameters:
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
 *         description: Conversations fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/single:
 *   get:
 *     summary: Get conversation by id
 *     tags: [Conversation]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Conversation fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/create:
 *   post:
 *     summary: Create conversation
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Follow-up on ticket
 *               ticket_id:
 *                 type: number
 *               contact_id:
 *                 type: number
 *               created_by:
 *                 type: number
 *     responses:
 *       200:
 *         description: Conversation created successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/update:
 *   put:
 *     summary: Update conversation
 *     tags: [Conversation]
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
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/delete:
 *   delete:
 *     summary: Delete conversation
 *     tags: [Conversation]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/messages:
 *   get:
 *     summary: List conversation messages
 *     tags: [Conversation]
 *     parameters:
 *       - in: query
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *       401:
 *         description: Unauthenticated
 *   post:
 *     summary: Send message
 *     tags: [Conversation]
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
 *               message:
 *                 type: string
 *                 example: Hello, how can I help?
 *               contact_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /conversation/mark-read:
 *   post:
 *     summary: Mark conversation messages as read
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversation_id]
 *             properties:
 *               conversation_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       401:
 *         description: Unauthenticated
 */
