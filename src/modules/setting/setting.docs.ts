/**
 * Contains API documentation of setting module
 */

/**
 * @swagger
 * tags:
 *   name: Setting
 *   description: Setting management
 */

/**
 * @swagger
 * /setting/all:
 *   get:
 *     summary: List settings
 *     tags: [Setting]
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
 *         description: Settings fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/single:
 *   get:
 *     summary: Get setting by id
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Setting fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/create:
 *   post:
 *     summary: Create setting
 *     tags: [Setting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: App Name
 *               slug:
 *                 type: string
 *                 example: app_name
 *               type:
 *                 type: string
 *                 example: text
 *               value:
 *                 type: string
 *                 example: Help Desk
 *     responses:
 *       200:
 *         description: Setting created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /setting/update:
 *   put:
 *     summary: Update setting
 *     tags: [Setting]
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
 *                 example: App Name
 *               slug:
 *                 type: string
 *                 example: app_name
 *               type:
 *                 type: string
 *                 example: text
 *               value:
 *                 type: string
 *                 example: Help Desk
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/delete:
 *   delete:
 *     summary: Delete setting
 *     tags: [Setting]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Setting deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /setting/restore:
 *   post:
 *     summary: Restore deleted setting
 *     tags: [Setting]
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
 *         description: Setting restored successfully
 *       401:
 *         description: Unauthenticated
 */
