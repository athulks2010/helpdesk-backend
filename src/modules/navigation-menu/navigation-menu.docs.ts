/**
 * Contains API documentation of navigation-menu module
 */

/**
 * @swagger
 * tags:
 *   name: NavigationMenu
 *   description: Navigation menu management
 */

/**
 * @swagger
 * /navigation-menu/all:
 *   get:
 *     summary: List navigation menus
 *     tags: [NavigationMenu]
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
 *         description: Navigation menus fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /navigation-menu/single:
 *   get:
 *     summary: Get navigation menu by id
 *     tags: [NavigationMenu]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Navigation menu fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /navigation-menu/create:
 *   post:
 *     summary: Create navigation menu
 *     tags: [NavigationMenu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label]
 *             properties:
 *               location:
 *                 type: string
 *                 example: header
 *               label:
 *                 type: string
 *                 example: FAQs
 *               route_name:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               route_params:
 *                 type: object
 *                 nullable: true
 *                 example: null
 *               url:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               icon:
 *                 type: string
 *                 nullable: true
 *                 example: help-circle
 *               active_key:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               feature_slug:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               target:
 *                 type: string
 *                 example: _self
 *               sort_order:
 *                 type: number
 *                 example: 3
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Navigation menu created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /navigation-menu/update:
 *   put:
 *     summary: Update navigation menu
 *     tags: [NavigationMenu]
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
 *               location:
 *                 type: string
 *                 example: header
 *               label:
 *                 type: string
 *                 example: FAQs
 *               route_name:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               route_params:
 *                 type: object
 *                 nullable: true
 *                 example: null
 *               url:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               icon:
 *                 type: string
 *                 nullable: true
 *                 example: help-circle
 *               active_key:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               feature_slug:
 *                 type: string
 *                 nullable: true
 *                 example: faq
 *               target:
 *                 type: string
 *                 example: _self
 *               sort_order:
 *                 type: number
 *                 example: 3
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Navigation menu updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /navigation-menu/delete:
 *   delete:
 *     summary: Delete navigation menu
 *     tags: [NavigationMenu]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Navigation menu deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /navigation-menu/restore:
 *   post:
 *     summary: Restore deleted navigation menu
 *     tags: [NavigationMenu]
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
 *         description: Navigation menu restored successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * /navigation-menu/reorder:
 *   post:
 *     summary: Reorder navigation menus
 *     tags: [NavigationMenu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 sort_order:
 *                   type: number
 *             example:
 *               - id: 1
 *                 sort_order: 1
 *               - id: 2
 *                 sort_order: 2
 *     responses:
 *       200:
 *         description: Navigation menus reordered successfully
 *       401:
 *         description: Unauthenticated
 */

