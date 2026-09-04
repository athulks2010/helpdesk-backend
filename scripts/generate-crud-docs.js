const fs = require('fs')
const path = require('path')

const crudModules = [
  {
    dir: 'contact',
    tag: 'Contact',
    base: '/contact',
    singular: 'Contact',
    plural: 'Contacts',
    createProps: `
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
 *                 type: string`,
  },
  {
    dir: 'organization',
    tag: 'Organization',
    base: '/organization',
    singular: 'Organization',
    plural: 'Organizations',
    createProps: `
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
 *                 type: string`,
  },
  {
    dir: 'category',
    tag: 'Category',
    base: '/category',
    singular: 'Category',
    plural: 'Categories',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Billing
 *               slug:
 *                 type: string
 *                 example: billing
 *               department_id:
 *                 type: number
 *               parent_id:
 *                 type: number`,
  },
  {
    dir: 'priority',
    tag: 'Priority',
    base: '/priority',
    singular: 'Priority',
    plural: 'Priorities',
    createProps: `
 *               name:
 *                 type: string
 *                 example: High
 *               color:
 *                 type: string
 *                 example: '#ef4444'`,
  },
  {
    dir: 'status',
    tag: 'Status',
    base: '/status',
    singular: 'Status',
    plural: 'Statuses',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Open
 *               slug:
 *                 type: string
 *                 example: open
 *               color:
 *                 type: string
 *                 example: '#22c55e'`,
  },
  {
    dir: 'department',
    tag: 'Department',
    base: '/department',
    singular: 'Department',
    plural: 'Departments',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Technical Support`,
  },
  {
    dir: 'type',
    tag: 'Type',
    base: '/type',
    singular: 'Type',
    plural: 'Types',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Bug Report
 *               slug:
 *                 type: string
 *                 example: bug-report`,
  },
  {
    dir: 'faq',
    tag: 'FAQ',
    base: '/faq',
    singular: 'FAQ',
    plural: 'FAQs',
    createProps: `
 *               question:
 *                 type: string
 *                 example: How do I reset my password?
 *               answer:
 *                 type: string
 *                 example: Use the forgot password link on the login page.
 *               order:
 *                 type: number
 *                 example: 1`,
  },
  {
    dir: 'note',
    tag: 'Note',
    base: '/note',
    singular: 'Note',
    plural: 'Notes',
    createProps: `
 *               title:
 *                 type: string
 *                 example: Follow up
 *               content:
 *                 type: string
 *                 example: Call customer tomorrow
 *               user_id:
 *                 type: number`,
  },
  {
    dir: 'setting',
    tag: 'Setting',
    base: '/setting',
    singular: 'Setting',
    plural: 'Settings',
    createProps: `
 *               name:
 *                 type: string
 *                 example: App Name
 *               slug:
 *                 type: string
 *                 example: app_name
 *               type:
 *                 type: string
 *                 example: text
 *               value:
 *                 type: string
 *                 example: Help Desk`,
  },
  {
    dir: 'language',
    tag: 'Language',
    base: '/language',
    singular: 'Language',
    plural: 'Languages',
    createProps: `
 *               name:
 *                 type: string
 *                 example: English
 *               code:
 *                 type: string
 *                 example: en
 *               flag:
 *                 type: string
 *                 example: us
 *               is_default:
 *                 type: boolean
 *                 example: true`,
  },
  {
    dir: 'email-template',
    tag: 'EmailTemplate',
    base: '/email-template',
    singular: 'Email template',
    plural: 'Email templates',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Ticket updated
 *               slug:
 *                 type: string
 *                 example: ticket_updated
 *               subject:
 *                 type: string
 *                 example: Your ticket was updated
 *               body:
 *                 type: string
 *               details:
 *                 type: string
 *               language:
 *                 type: string
 *                 example: en`,
  },
  {
    dir: 'navigation-menu',
    tag: 'NavigationMenu',
    base: '/navigation-menu',
    singular: 'Navigation menu',
    plural: 'Navigation menus',
    createProps: `
 *               name:
 *                 type: string
 *                 example: Home
 *               url:
 *                 type: string
 *                 example: /
 *               order:
 *                 type: number
 *                 example: 1
 *               parent_id:
 *                 type: number`,
  },
  {
    dir: 'front-page',
    tag: 'FrontPage',
    base: '/front-page',
    singular: 'Front page',
    plural: 'Front pages',
    createProps: `
 *               title:
 *                 type: string
 *                 example: Home
 *               slug:
 *                 type: string
 *                 example: home
 *               content:
 *                 type: string
 *               meta:
 *                 type: string
 *               is_active:
 *                 type: number
 *                 example: 1`,
  },
  {
    dir: 'service',
    tag: 'Service',
    base: '/service',
    singular: 'Service',
    plural: 'Services',
    createProps: `
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
 *                 type: number`,
  },
  {
    dir: 'knowledge-base',
    tag: 'KnowledgeBase',
    base: '/knowledge-base',
    singular: 'Knowledge base article',
    plural: 'Knowledge base articles',
    createProps: `
 *               title:
 *                 type: string
 *                 example: Getting started
 *               slug:
 *                 type: string
 *                 example: getting-started
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number`,
  },
  {
    dir: 'post',
    tag: 'Post',
    base: '/post',
    singular: 'Post',
    plural: 'Posts',
    createProps: `
 *               title:
 *                 type: string
 *                 example: Product update
 *               slug:
 *                 type: string
 *                 example: product-update
 *               content:
 *                 type: string
 *               type_id:
 *                 type: number
 *               author_id:
 *                 type: number
 *               cover:
 *                 type: string`,
  },
]

function build(m) {
  return `/**
 * Contains API documentation of ${m.dir} module
 */

/**
 * @swagger
 * tags:
 *   name: ${m.tag}
 *   description: ${m.singular} management
 */

/**
 * @swagger
 * ${m.base}/all:
 *   get:
 *     summary: List ${m.plural.toLowerCase()}
 *     tags: [${m.tag}]
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
 *         description: ${m.plural} fetched successfully
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * ${m.base}/single:
 *   get:
 *     summary: Get ${m.singular.toLowerCase()} by id
 *     tags: [${m.tag}]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: ${m.singular} fetched successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * ${m.base}/create:
 *   post:
 *     summary: Create ${m.singular.toLowerCase()}
 *     tags: [${m.tag}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:${m.createProps}
 *     responses:
 *       200:
 *         description: ${m.singular} created successfully
 *       400:
 *         description: Validation exception
 *       401:
 *         description: Unauthenticated
 */

/**
 * @swagger
 * ${m.base}/update:
 *   put:
 *     summary: Update ${m.singular.toLowerCase()}
 *     tags: [${m.tag}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: number${m.createProps}
 *     responses:
 *       200:
 *         description: ${m.singular} updated successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * ${m.base}/delete:
 *   delete:
 *     summary: Delete ${m.singular.toLowerCase()}
 *     tags: [${m.tag}]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: ${m.singular} deleted successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * ${m.base}/restore:
 *   post:
 *     summary: Restore deleted ${m.singular.toLowerCase()}
 *     tags: [${m.tag}]
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
 *         description: ${m.singular} restored successfully
 *       401:
 *         description: Unauthenticated
 */
`
}

for (const m of crudModules) {
  const file = path.join('src/modules', m.dir, `${m.dir}.docs.ts`)
  fs.writeFileSync(file, build(m))
  console.log('wrote', file)
}
