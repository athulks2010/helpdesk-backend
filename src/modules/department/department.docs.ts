/**
 * Contains API documentation of department module
 */

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department management
 */

/**
 * @swagger
 * /department/all:
 *   get:
 *     summary: List departments
 *     tags: [Department]
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
 *         description: Departments fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /department/single:
 *   get:
 *     summary: Get department by id
 *     tags: [Department]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Department fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /department/create:
 *   post:
 *     summary: Create department
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Technical Support
 *     responses:
 *       200:
 *         description: Department created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /department/update:
 *   put:
 *     summary: Update department
 *     tags: [Department]
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
 *                 example: Technical Support
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /department/delete:
 *   delete:
 *     summary: Delete department
 *     tags: [Department]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /department/restore:
 *   post:
 *     summary: Restore deleted department
 *     tags: [Department]
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
 *         description: Department restored successfully
 *       401:
 *         description: Unauthenticated
 */
