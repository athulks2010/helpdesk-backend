/**
 * Contains API documentation of contact module
 */

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact management
 */

/**
 * @swagger
 * /contact/all:
 *   get:
 *     summary: List contacts
 *     tags: [Contact]
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
 *         description: Contacts fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /contact/single:
 *   get:
 *     summary: Get contact by id
 *     tags: [Contact]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Contact fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /contact/create:
 *   post:
 *     summary: Create contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Jane
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *               organization_id:
 *                 type: number
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: number
 *     responses:
 *       200:
 *         description: Contact created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /contact/update:
 *   put:
 *     summary: Update contact
 *     tags: [Contact]
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
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *               organization_id:
 *                 type: number
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: number
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /contact/delete:
 *   delete:
 *     summary: Delete contact
 *     tags: [Contact]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /contact/restore:
 *   post:
 *     summary: Restore deleted contact
 *     tags: [Contact]
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
 *         description: Contact restored successfully
 *       401:
 *         description: Unauthenticated
 */
