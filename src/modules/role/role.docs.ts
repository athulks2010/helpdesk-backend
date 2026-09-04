/**
 * Contains API documentation of role module
 */

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management
 */

/**
 * @swagger
 * /role/all:
 *   get:
 *     summary: List roles
 *     tags: [Role]
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
 *         description: Roles fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /role/single:
 *   get:
 *     summary: Get role by id
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Create role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Support Lead
 *               slug:
 *                 type: string
 *                 example: support-lead
 *               access:
 *                 type: object
 *                 example: { ticket: { read: true, create: true, update: true, delete: false } }
 *     responses:
 *       200:
 *         description: Role created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /role/update:
 *   put:
 *     summary: Update role
 *     tags: [Role]
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
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Admin
 *               slug:
 *                 type: string
 *                 example: admin
 *               access:
 *                 type: object
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /role/delete:
 *   delete:
 *     summary: Delete role
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /role/restore:
 *   post:
 *     summary: Restore deleted role
 *     tags: [Role]
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Role restored successfully
 *       401:
 *         description: Unauthenticated
 */
