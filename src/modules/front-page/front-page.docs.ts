/**
 * Contains API documentation of front-page module
 */

/**
 * @swagger
 * tags:
 *   name: FrontPage
 *   description: Front page management
 */

/**
 * @swagger
 * /front-page/all:
 *   get:
 *     summary: List front pages
 *     tags: [FrontPage]
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
 *         description: Front pages fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /front-page/single:
 *   get:
 *     summary: Get front page by id
 *     tags: [FrontPage]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Front page fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /front-page/create:
 *   post:
 *     summary: Create front page
 *     tags: [FrontPage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Home
 *               slug:
 *                 type: string
 *                 example: home
 *               content:
 *                 type: string
 *               meta:
 *                 type: string
 *               is_active:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Front page created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /front-page/update:
 *   put:
 *     summary: Update front page
 *     tags: [FrontPage]
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
 *                 example: Home
 *               slug:
 *                 type: string
 *                 example: home
 *               content:
 *                 type: string
 *               meta:
 *                 type: string
 *               is_active:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Front page updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /front-page/delete:
 *   delete:
 *     summary: Delete front page
 *     tags: [FrontPage]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Front page deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /front-page/restore:
 *   post:
 *     summary: Restore deleted front page
 *     tags: [FrontPage]
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
 *         description: Front page restored successfully
 *       401:
 *         description: Unauthenticated
 */
