/**
 * Contains API documentation of ticket-field module
 */

/**
 * @swagger
 * tags:
 *   name: TicketField
 *   description: Custom ticket form builder
 */

/**
 * @swagger
 * /ticket-field/all:
 *   get:
 *     summary: List ticket fields
 *     tags: [TicketField]
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
 *           example: 200
 *     responses:
 *       200:
 *         description: Ticket fields fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket-field/single:
 *   get:
 *     summary: Get ticket field by id
 *     tags: [TicketField]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket field fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /ticket-field/create:
 *   post:
 *     summary: Create ticket field
 *     tags: [TicketField]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, label, name]
 *             properties:
 *               type:
 *                 type: string
 *                 example: text
 *               label:
 *                 type: string
 *                 example: Serial number
 *               name:
 *                 type: string
 *                 example: serial_no
 *               placeholder:
 *                 type: string
 *                 example: e.g. ABC-99
 *               required:
 *                 type: number
 *                 example: 1
 *               hint:
 *                 type: string
 *                 example: From the device label
 *               options:
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Ticket field created successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket-field/update:
 *   put:
 *     summary: Update ticket field
 *     tags: [TicketField]
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
 *               type:
 *                 type: string
 *               label:
 *                 type: string
 *               name:
 *                 type: string
 *               placeholder:
 *                 type: string
 *               required:
 *                 type: number
 *               hint:
 *                 type: string
 *               options:
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Ticket field updated successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /ticket-field/delete:
 *   delete:
 *     summary: Delete ticket field
 *     tags: [TicketField]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket field deleted successfully
 *       401:
 *         description: Unauthenticated
 */
