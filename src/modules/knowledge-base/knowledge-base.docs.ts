/**
 * Contains API documentation of knowledge-base module
 */

/**
 * @swagger
 * tags:
 *   name: KnowledgeBase
 *   description: Knowledge base article management
 */

/**
 * @swagger
 * /knowledge-base/all:
 *   get:
 *     summary: List knowledge base articles
 *     tags: [KnowledgeBase]
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
 *         description: Knowledge base articles fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /knowledge-base/single:
 *   get:
 *     summary: Get knowledge base article by id
 *     tags: [KnowledgeBase]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Knowledge base article fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /knowledge-base/create:
 *   post:
 *     summary: Create knowledge base article
 *     tags: [KnowledgeBase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Getting started
 *               slug:
 *                 type: string
 *                 example: getting-started
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Knowledge base article created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /knowledge-base/update:
 *   put:
 *     summary: Update knowledge base article
 *     tags: [KnowledgeBase]
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
 *               title:
 *                 type: string
 *                 example: Getting started
 *               slug:
 *                 type: string
 *                 example: getting-started
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Knowledge base article updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /knowledge-base/delete:
 *   delete:
 *     summary: Delete knowledge base article
 *     tags: [KnowledgeBase]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Knowledge base article deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /knowledge-base/restore:
 *   post:
 *     summary: Restore deleted knowledge base article
 *     tags: [KnowledgeBase]
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
 *         description: Knowledge base article restored successfully
 *       401:
 *         description: Unauthenticated
 */
