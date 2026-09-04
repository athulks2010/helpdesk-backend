/**
 * Contains API documentation of post module
 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post management
 */

/**
 * @swagger
 * /post/all:
 *   get:
 *     summary: List posts
 *     tags: [Post]
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
 *         description: Posts fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /post/single:
 *   get:
 *     summary: Get post by id
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Product update
 *               slug:
 *                 type: string
 *                 example: product-update
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number
 *               author_id:
 *                 type: number
 *               cover:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /post/update:
 *   put:
 *     summary: Update post
 *     tags: [Post]
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
 *                 example: Product update
 *               slug:
 *                 type: string
 *                 example: product-update
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number
 *               author_id:
 *                 type: number
 *               cover:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /post/delete:
 *   delete:
 *     summary: Delete post
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /post/restore:
 *   post:
 *     summary: Restore deleted post
 *     tags: [Post]
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
 *         description: Post restored successfully
 *       401:
 *         description: Unauthenticated
 */
