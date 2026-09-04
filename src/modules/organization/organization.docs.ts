/**
 * Contains API documentation of organization module
 */

/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management
 */

/**
 * @swagger
 * /organization/all:
 *   get:
 *     summary: List organizations
 *     tags: [Organization]
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
 *         description: Organizations fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /organization/single:
 *   get:
 *     summary: Get organization by id
 *     tags: [Organization]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Organization fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /organization/create:
 *   post:
 *     summary: Create organization
 *     tags: [Organization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corp
 *               email:
 *                 type: string
 *                 example: info@acme.com
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /organization/update:
 *   put:
 *     summary: Update organization
 *     tags: [Organization]
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
 *                 example: Acme Corp
 *               email:
 *                 type: string
 *                 example: info@acme.com
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /organization/delete:
 *   delete:
 *     summary: Delete organization
 *     tags: [Organization]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /organization/restore:
 *   post:
 *     summary: Restore deleted organization
 *     tags: [Organization]
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
 *         description: Organization restored successfully
 *       401:
 *         description: Unauthenticated
 */
