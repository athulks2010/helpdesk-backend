/**
 * Contains API documentation of user module
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: List users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: number
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
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/single:
 *   get:
 *     summary: Get user by id
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Jane
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane.smith@example.com
 *               password:
 *                 type: string
 *                 example: Password1
 *               phone:
 *                 type: string
 *                 example: "+1 555 0100"
 *               city:
 *                 type: string
 *                 example: Chennai
 *               address:
 *                 type: string
 *                 example: 12 Anna Salai
 *               country_id:
 *                 type: number
 *                 example: 1
 *               role_id:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user
 *     tags: [User]
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
 *               first_name:
 *                 type: string
 *                 example: Jane
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane.smith@example.com
 *               phone:
 *                 type: string
 *                 example: "+1 555 0100"
 *               city:
 *                 type: string
 *                 example: Chennai
 *               address:
 *                 type: string
 *                 example: 12 Anna Salai
 *               country_id:
 *                 type: number
 *                 example: 1
 *               role_id:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/restore:
 *   post:
 *     summary: Restore deleted user
 *     tags: [User]
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
 *         description: User restored successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/pending:
 *   get:
 *     summary: List pending users
 *     tags: [User]
 *     parameters:
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
 *         description: Pending users fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/pending/approve:
 *   post:
 *     summary: Approve pending user
 *     tags: [User]
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
 *         description: Pending user approved
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /user/pending/decline:
 *   post:
 *     summary: Decline pending user
 *     tags: [User]
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
 *         description: Pending user declined
 *       401:
 *         description: Unauthenticated
 */
