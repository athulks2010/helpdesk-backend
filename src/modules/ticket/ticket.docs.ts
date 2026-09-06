/**
 * Contains API documentation of ticket module
 */

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Ticket management
 */

/**
 * @swagger
 * /ticket/all:
 *   get:
 *     summary: List tickets
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: status_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: priority_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: assigned_to
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
 *         description: Tickets fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket/single:
 *   get:
 *     summary: Get ticket by id
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /ticket/create:
 *   post:
 *     summary: Create ticket
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject, details]
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Cannot login to the portal
 *               details:
 *                 type: string
 *                 example: I get an invalid credentials error after password reset.
 *               user_id:
 *                 type: number
 *                 example: 1
 *               priority_id:
 *                 type: number
 *                 example: 1
 *               status_id:
 *                 type: number
 *                 example: 1
 *               department_id:
 *                 type: number
 *                 example: 1
 *               assigned_to:
 *                 type: number
 *                 example: 2
 *               category_id:
 *                 type: number
 *                 example: 1
 *               sub_category_id:
 *                 type: number
 *                 nullable: true
 *                 example: null
 *               type_id:
 *                 type: number
 *                 example: 1
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["login", "urgent"]
 *               custom_field:
 *                 type: object
 *                 example:
 *                   business_impact: high
 *                   expected_resolution: By end of day
 *     responses:
 *       200:
 *         description: Ticket created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket/update:
 *   put:
 *     summary: Update ticket
 *     tags: [Ticket]
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
 *               subject:
 *                 type: string
 *                 example: Cannot login to the portal
 *               details:
 *                 type: string
 *                 example: I get an invalid credentials error after password reset.
 *               user_id:
 *                 type: number
 *                 example: 1
 *               status_id:
 *                 type: number
 *                 example: 1
 *               priority_id:
 *                 type: number
 *                 example: 1
 *               department_id:
 *                 type: number
 *                 example: 1
 *               assigned_to:
 *                 type: number
 *                 example: 2
 *               category_id:
 *                 type: number
 *                 example: 1
 *               sub_category_id:
 *                 type: number
 *                 nullable: true
 *                 example: null
 *               type_id:
 *                 type: number
 *                 example: 1
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["login", "urgent"]
 *               custom_field:
 *                 type: object
 *                 example:
 *                   business_impact: high
 *                   expected_resolution: By end of day
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket/delete:
 *   delete:
 *     summary: Delete ticket
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket/restore:
 *   post:
 *     summary: Restore deleted ticket
 *     tags: [Ticket]
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
 *         description: Ticket restored successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket/activities:
 *   get:
 *     summary: List ticket activity timeline
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket activities fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /ticket/comments:
 *   get:
 *     summary: List ticket comments
 *     tags: [Ticket]
 *     parameters:
 *       - in: query
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       401:
 *         description: Unauthenticated
 *   post:
 *     summary: Add ticket comment
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ticket_id, body]
 *             properties:
 *               ticket_id:
 *                 type: number
 *               body:
 *                 type: string
 *                 example: Investigating this issue
 *               contact_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthenticated
 */
