/**
 * Contains API documentation of service module
 */

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Service management
 */

/**
 * @swagger
 * /service/all:
 *   get:
 *     summary: List services
 *     tags: [Service]
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
 *         description: Services fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /service/single:
 *   get:
 *     summary: Get service by id
 *     tags: [Service]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Service fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /service/create:
 *   post:
 *     summary: Create service
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implementation
 *               slug:
 *                 type: string
 *                 example: implementation
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               author_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /service/update:
 *   put:
 *     summary: Update service
 *     tags: [Service]
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
 *                 example: Implementation
 *               slug:
 *                 type: string
 *                 example: implementation
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               author_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /service/delete:
 *   delete:
 *     summary: Delete service
 *     tags: [Service]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /service/restore:
 *   post:
 *     summary: Restore deleted service
 *     tags: [Service]
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
 *         description: Service restored successfully
 *       401:
 *         description: Unauthenticated
 */
