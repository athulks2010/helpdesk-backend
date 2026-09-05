/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@opsotech.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     security: []
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
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@helpdesk.local
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password1
 *               password_confirmation:
 *                 type: string
 *                 example: Password1
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               country_id:
 *                 type: integer
 *                 example: 1
 *               city:
 *                 type: string
 *                 example: "New York"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Validation exception
 *       409:
 *         description: Similar record already exists
 */

/**
 * @swagger
 * /auth/password/reset:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
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
 *                 example: admin@opsotech.com
 *     responses:
 *       200:
 *         description: Reset link sent if account exists
 *       400:
 *         description: Validation exception
 */

/**
 * @swagger
 * /auth/password/reset/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@opsotech.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password1
 *               password_confirmation:
 *                 type: string
 *                 example: Password1
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation exception
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthenticated
 */
