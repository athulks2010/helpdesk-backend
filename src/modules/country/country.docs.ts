/**
 * Contains API documentation of country module
 */

/**
 * @swagger
 * tags:
 *   name: Country
 *   description: Country lookup
 */

/**
 * @swagger
 * /country/all:
 *   get:
 *     summary: List countries
 *     tags: [Country]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           example: IN
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *           example: 300
 *     responses:
 *       200:
 *         description: Countries fetched successfully
 */

/**
 * @swagger
 * /country/single:
 *   get:
 *     summary: Get country by id or ISO code
 *     tags: [Country]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           example: 101
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           example: IN
 *     responses:
 *       200:
 *         description: Country fetched successfully
 *       404:
 *         description: Record not found
 */
