import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const allTrue = { read: true, create: true, delete: true, update: true }
const allFalse = { read: false, create: false, delete: false, update: false }

const roleAccess = {
  admin: {
    faq: allTrue,
    blog: allTrue,
    chat: allTrue,
    smtp: allTrue,
    type: allTrue,
    user: allTrue,
    global: allTrue,
    pusher: allTrue,
    status: allTrue,
    ticket: allTrue,
    contact: allTrue,
    category: allTrue,
    customer: allTrue,
    language: allTrue,
    priority: allTrue,
    department: allTrue,
    front_page: allTrue,
    organization: allTrue,
    email_template: allTrue,
    knowledge_base: allTrue,
  },
  customer: {
    faq: allFalse,
    blog: allFalse,
    chat: allFalse,
    smtp: allFalse,
    type: allFalse,
    user: allFalse,
    global: allFalse,
    pusher: allFalse,
    status: allFalse,
    ticket: { read: true, create: true, delete: false, update: false },
    contact: allFalse,
    category: allFalse,
    customer: allFalse,
    language: allFalse,
    priority: allFalse,
    department: allFalse,
    front_page: allFalse,
    organization: allFalse,
    email_template: allFalse,
    knowledge_base: allFalse,
  },
  agency: {
    faq: allTrue,
    blog: allTrue,
    chat: allTrue,
    smtp: allFalse,
    type: allFalse,
    user: allFalse,
    global: allFalse,
    pusher: allFalse,
    status: allFalse,
    ticket: { read: true, create: true, delete: false, update: true },
    contact: allTrue,
    category: allFalse,
    customer: { read: true, create: true, delete: false, update: true },
    language: allFalse,
    priority: allFalse,
    department: allFalse,
    front_page: allFalse,
    organization: allTrue,
    email_template: allFalse,
    knowledge_base: allFalse,
  },
  general: {
    faq: allFalse,
    blog: allFalse,
    chat: allFalse,
    smtp: allFalse,
    type: allFalse,
    user: allFalse,
    global: allFalse,
    pusher: allFalse,
    status: allFalse,
    ticket: allTrue,
    contact: allFalse,
    category: allFalse,
    customer: allFalse,
    language: allFalse,
    priority: allFalse,
    department: allFalse,
    front_page: allFalse,
    organization: allFalse,
    email_template: allFalse,
    knowledge_base: allFalse,
  },
  agent: {
    faq: allFalse,
    blog: allFalse,
    chat: allTrue,
    smtp: allFalse,
    type: allFalse,
    user: allFalse,
    global: allFalse,
    pusher: allFalse,
    status: allFalse,
    ticket: allTrue,
    contact: allFalse,
    category: allFalse,
    customer: allFalse,
    language: allFalse,
    priority: allFalse,
    department: allFalse,
    front_page: allFalse,
    organization: allFalse,
    email_template: allFalse,
    knowledge_base: allFalse,
  },
}

function loadCountries() {
  const jsonPath = path.join(__dirname, 'seed-data', 'countries.json')
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as { name: string; code: string }[]
  }

  const phpPath = path.resolve(
    __dirname,
    '../../HelpDesk/database/seeders/CountrySeeder.php'
  )
  if (!fs.existsSync(phpPath)) {
    console.warn('CountrySeeder.php not found; skipping countries')
    return []
  }
  const source = fs.readFileSync(phpPath, 'utf8')
  const re = /\['name'\s*=>\s*'((?:\\'|[^'])*)'\s*,\s*'code'\s*=>\s*'([A-Z]{2})'\]/g
  const countries: { name: string; code: string }[] = []
  let match: RegExpExecArray | null
  while ((match = re.exec(source))) {
    countries.push({ name: match[1].replace(/\\'/g, "'"), code: match[2] })
  }
  return countries
}

function loadEmailHtml(fileName: string) {
  const candidates = [
    path.resolve(__dirname, '../../HelpDesk/public/html/email_templates', fileName),
    path.resolve(process.cwd(), '../HelpDesk/public/html/email_templates', fileName),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs
        .readFileSync(candidate, 'utf8')
        .replace(
          'https://res.cloudinary.com/robinbd/image/upload/v1663394454/mail-template/help-desk-logo.png',
          '/images/logo.png'
        )
    }
  }
  return `<p>${fileName}</p>`
}

async function seedRoles() {
  const roles = [
    { id: 1n, name: 'Admin', slug: 'admin', access: JSON.stringify(roleAccess.admin) },
    { id: 2n, name: 'Customer', slug: 'customer', access: JSON.stringify(roleAccess.customer) },
    { id: 3n, name: 'Agency', slug: 'agency', access: JSON.stringify(roleAccess.agency) },
    { id: 4n, name: 'Manager', slug: 'manager', access: JSON.stringify(roleAccess.agency) },
    { id: 5n, name: 'General', slug: 'general', access: JSON.stringify(roleAccess.general) },
    { id: 6n, name: 'Agent', slug: 'agent', access: JSON.stringify(roleAccess.agent) },
  ]
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name, slug: role.slug, access: role.access },
      create: role,
    })
  }
}

async function seedLanguages() {
  const languages = [
    { name: 'English', code: 'en', flag: 'us', is_default: true },
    { name: 'German', code: 'de', flag: 'de' },
    { name: 'Chinese', code: 'cn', flag: 'cn' },
    { name: 'Bengali', code: 'bd', flag: 'bd' },
    { name: 'Urdu', code: 'ur', flag: 'pk' },
    { name: 'Dutch', code: 'nl', flag: 'nl' },
    { name: 'Italian', code: 'it', flag: 'it' },
    { name: 'Arabic', code: 'sa', flag: 'sa' },
    { name: 'Turkish', code: 'tr', flag: 'tr' },
    { name: 'Indonesian', code: 'id', flag: 'id' },
    { name: 'Spanish', code: 'es', flag: 'es' },
    { name: 'Swedish', code: 'se', flag: 'se' },
    { name: 'Portuguese', code: 'pt', flag: 'pt' },
    { name: 'Portuguese - Brazil', code: 'pt-BR', flag: 'pt_br' },
    { name: 'Hebrew', code: 'he', flag: 'il' },
    { name: 'Lithuanian', code: 'lt', flag: 'lt' },
    { name: 'Polish', code: 'pl', flag: 'pl' },
    { name: 'French', code: 'fr', flag: 'fr' },
  ]
  await prisma.language.createMany({ data: languages })
}

async function seedSettings() {
  const enableOptions = [
    { name: 'Chat', slug: 'chat', value: false },
    { name: 'FAQ', slug: 'faq', value: true },
    { name: 'Knowledge Base', slug: 'kb', value: true },
    { name: 'Blog', slug: 'blog', value: true },
    { name: 'Contacts', slug: 'contact', value: true },
    { name: 'Organizations', slug: 'organization', value: true },
    { name: 'Notes', slug: 'note', value: true },
    { name: 'Show Login on front page', slug: 'show_login', value: true },
    { name: 'Email to tickets(piping)', slug: 'enable_piping', value: true },
    { name: 'Service Page', slug: 'service', value: true },
    { name: 'Show Color Picker', slug: 'color_picker', value: true },
    { name: 'Require Login to Submit Ticket', slug: 'require_login_submit_ticket', value: false },
    { name: 'Contact Page', slug: 'contact_page', value: true },
    { name: 'Terms of Services', slug: 'terms_of_services', value: true },
    { name: 'Privacy Policy', slug: 'privacy_policy', value: true },
    { name: 'Newsletter', slug: 'newsletter', value: true },
    { name: 'Enable Registration', slug: 'enable_registration', value: true },
  ]
  const emailNotifications = [
    { name: 'Create ticket by new customer', slug: 'create_ticket_new_customer', value: false },
    { name: 'Create ticket from dashboard', slug: 'create_ticket_dashboard', value: false },
    { name: 'Notification for the first comment', slug: 'first_comment', value: false },
    { name: 'User got assigned for a task', slug: 'assigned_ticket', value: false },
    { name: 'Status or priority changes', slug: 'status_priority', value: false },
    { name: 'Create a new user', slug: 'user_created', value: false },
  ]

  await prisma.setting.createMany({
    data: [
      { name: 'App Name', slug: 'app_name', type: 'text', value: 'Help Desk' },
      { name: 'Email Recipient for customer ticket', slug: 'default_recipient', type: 'text', value: '1' },
      { name: 'Default Language', slug: 'default_language', type: 'text', value: 'en' },
      { name: 'Main Logo', slug: 'main_logo', type: 'text', value: '/images/logo.png' },
      { name: 'Main Logo White', slug: 'main_logo_white', type: 'text', value: '/images/logo_white.png' },
      { name: 'Main Favicon', slug: 'main_favicon', type: 'text', value: '/favicon.png' },
      { name: 'Hide_ticket_fields', slug: 'hide_ticket_fields', type: 'json', value: '[]' },
      { name: 'Required ticket fields', slug: 'required_ticket_fields', type: 'json', value: '[]' },
      { name: 'Footer Text', slug: 'footer_text', type: 'text', value: 'Help Desk © 2022 - Powered by W3BD' },
      { name: 'Enable Options', slug: 'enable_options', type: 'json', value: JSON.stringify(enableOptions) },
      {
        name: 'Email Notifications',
        slug: 'email_notifications',
        type: 'json',
        value: JSON.stringify(emailNotifications),
      },
    ],
  })
}

async function seedTicketTaxonomy() {
  await prisma.department.createMany({
    data: [
      { id: 1n, name: 'Sales' },
      { id: 2n, name: 'Management' },
      { id: 3n, name: 'Technical Support' },
      { id: 4n, name: 'Billing' },
      { id: 5n, name: 'Customer Success' },
      { id: 6n, name: 'Development' },
    ],
  })

  await prisma.category.createMany({
    data: [
      { id: 1n, name: 'New Customer', department_id: 1n },
      { id: 2n, name: 'Existing Customer', department_id: 1n },
      { id: 3n, name: 'Event', department_id: 2n },
      { id: 4n, name: 'Meeting', department_id: 2n },
      { id: 5n, name: 'Domain Issue', department_id: 3n },
      { id: 6n, name: 'Hosting Issue', department_id: 3n },
      { id: 7n, name: 'Domain', department_id: 4n },
      { id: 8n, name: 'Hosting', department_id: 4n },
      { id: 9n, name: 'Domain Price', parent_id: 7n },
      { id: 10n, name: 'Domain Purchase', parent_id: 7n },
      { id: 11n, name: 'Purchasing a new hosting', parent_id: 8n },
      { id: 12n, name: 'Pricing about hosting', parent_id: 8n },
      { id: 13n, name: 'New Event', parent_id: 3n },
      { id: 14n, name: 'Upcoming Event', parent_id: 3n },
      { id: 15n, name: 'Arrange A Meeting', parent_id: 4n },
      { id: 16n, name: 'Join with a call', parent_id: 4n },
      { id: 17n, name: 'Purchase Help', parent_id: 1n },
      { id: 18n, name: 'Pricing List', parent_id: 1n },
      { id: 19n, name: 'Migrate hosting plan', parent_id: 2n },
      { id: 20n, name: 'Change DNS', parent_id: 2n },
      { id: 21n, name: 'Existing DNS is not working', parent_id: 5n },
      { id: 22n, name: 'DNS Conflict', parent_id: 5n },
      { id: 23n, name: 'Server is not working', parent_id: 6n },
      { id: 24n, name: 'Low Speed', parent_id: 6n },
    ],
  })

  await prisma.priority.createMany({
    data: [{ name: 'Low' }, { name: 'Medium' }, { name: 'High' }, { name: 'Critical' }],
  })

  await prisma.status.createMany({
    data: [
      { name: 'Open', slug: 'open', color: '#22c55e' },
      { name: 'Pending', slug: 'pending', color: '#eab308' },
      { name: 'In Progress', slug: 'in_progress', color: '#3b82f6' },
      { name: 'Resolved', slug: 'resolved', color: '#14b8a6' },
      { name: 'Closed', slug: 'closed', color: '#6b7280' },
      { name: 'Cancelled', slug: 'cancelled', color: '#ef4444' },
    ],
  })

  await prisma.type.createMany({
    data: [
      { name: 'Bug Report', slug: 'bug-report' },
      { name: 'Feature Request', slug: 'feature-request' },
      { name: 'Question', slug: 'question' },
      { name: 'Service Request', slug: 'service-request' },
      { name: 'Incident', slug: 'incident' },
      { name: 'Maintenance', slug: 'maintenance' },
    ],
  })
}

async function seedEmailTemplates() {
  const templates = [
    {
      name: 'Create ticket by new customer',
      slug: 'create_ticket_new_customer',
      details: 'When customer create a new ticket from the landing page',
      file: 'create_ticket_new_customer.html',
    },
    {
      name: 'Create ticket from dashboard',
      slug: 'create_ticket_dashboard',
      details: 'When a ticket created from the admin page',
      file: 'create_ticket_from_dashboard.html',
    },
    {
      name: 'Custom Mail',
      slug: 'custom_mail',
      details: 'It will use to send any custom email.',
      file: 'custom_mail.html',
    },
    {
      name: 'Got assigned for a ticket',
      slug: 'assigned_ticket',
      details: 'When a user got assigned for a ticket.',
      file: 'ticket_assigned_user.html',
    },
    {
      name: 'The ticket has been updated',
      slug: 'ticket_updated',
      details: 'When a ticket has been updated.',
      file: 'ticket_updated.html',
    },
    {
      name: 'A new comment has been added on the ticket',
      slug: 'ticket_new_comment',
      details: 'When a comment has been added on a ticket.',
      file: 'ticket_new_comment.html',
    },
    {
      name: 'User created',
      slug: 'user_created',
      details: 'When a new user created.',
      file: 'user_created.html',
    },
    {
      name: 'Conversation Created',
      slug: 'conversation_created',
      details: 'When a new conversation is created and user is added as participant.',
      file: 'conversation_created.html',
    },
    {
      name: 'New Message in Conversation',
      slug: 'conversation_new_message',
      details: 'When a new message is sent in a conversation.',
      file: 'conversation_new_message.html',
    },
    {
      name: 'Added to Conversation',
      slug: 'conversation_participant_added',
      details: 'When a user is added to an existing conversation.',
      file: 'conversation_participant_added.html',
    },
  ]

  await prisma.emailTemplate.createMany({
    data: templates.map((t) => ({
      name: t.name,
      slug: t.slug,
      details: t.details,
      language: 'en',
      subject: t.name,
      body: loadEmailHtml(t.file),
    })),
  })
}

async function seedFrontPages() {
  const pages = [
    {
      title: 'Home',
      slug: 'home',
      content: {
        sections: [
          {
            title: 'Resolve customer issues faster with <span>HelpDesk</span>',
            badge_text: 'Trusted by support teams in 40+ countries',
            details:
              'Modernize your support operations with smart routing, collaborative agent tools, and transparent customer communication.',
            enabled: true,
          },
        ],
      },
    },
    {
      title: 'Contact',
      slug: 'contact',
      content: {
        content_text: 'Connect With Our Support Team',
        content_details:
          'Need help with onboarding, ticket workflows, or account issues? Reach out and our team will connect you with the right specialist.',
        email: 'support@yourhelpdesk.com',
        phone: '+1 (415) 555-0198',
        location: '8013 Alderwood St, South San Francisco, CA 94080',
        contact_recipient: 'support@yourhelpdesk.com',
      },
    },
    {
      title: 'Services',
      slug: 'services',
      content: {
        hero: {
          badge: 'HelpDesk Professional Services',
          title: 'Services Built For High-Performing Support Teams',
          subtitle:
            'From implementation to optimization, we help you launch, scale, and continuously improve your support operations.',
        },
      },
    },
    {
      title: 'Privacy',
      slug: 'privacy',
      content: { title: 'Privacy Policy', content: '<p>Your privacy policy content goes here.</p>' },
    },
    {
      title: 'Terms of Services',
      slug: 'terms',
      content: { title: 'Terms of Services', content: '<p>Your terms content goes here.</p>' },
    },
    {
      title: 'Footer Area',
      slug: 'footer',
      content: {
        title: 'Footer Area',
        text: 'Start working with HelpDesk and streamline customer support.',
        copyright: "@ Helpdesk Developed by <a href='https://w3bd.com/'>W3bd</a>.",
      },
    },
  ]

  await prisma.frontPage.createMany({
    data: pages.map((p) => ({
      title: p.title,
      slug: p.slug,
      is_active: 1,
      html: p.content,
    })),
  })
}

async function seedNavigationMenus() {
  await prisma.navigationMenu.createMany({
    data: [
      { label: 'Home', url: '/', sort_order: 1 },
      { label: 'Submit Ticket', url: '/ticket/open', sort_order: 2 },
      { label: 'Services', url: '/services', sort_order: 3 },
      { label: 'Knowledge Base', url: '/kb', sort_order: 4 },
      { label: 'FAQs', url: '/faq', sort_order: 5 },
      { label: 'Contact', url: '/contact', sort_order: 6 },
    ],
  })
}

async function seedMediaFolders() {
  await prisma.mediaFolder.create({
    data: { id: 1n, name: 'System Media Holder', parent_id: null },
  })
  await prisma.mediaFolder.create({
    data: { name: 'Images', parent_id: null },
  })
}

async function seedAdminUser() {
  const password = await bcrypt.hash('Admin@123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@opsotech.com' },
    update: {
      first_name: 'Admin',
      last_name: 'User',
      password,
      role_id: 1n,
      locale: 'en',
      title: 'Administrator',
      email_verified_at: new Date(),

    },
    create: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@opsotech.com',
      password,
      role_id: 1n,
      locale: 'en',
      title: 'Administrator',
      email_verified_at: new Date(),
    },
  })
}

async function main() {
  console.log('Seeding database...')

  await seedRoles()
  console.log('✓ roles')

  const countries = loadCountries()
  if (countries.length) {
    await prisma.country.createMany({ data: countries })
    console.log(`✓ countries (${countries.length})`)
  }

  await seedEmailTemplates()
  console.log('✓ email_templates')

  await seedFrontPages()
  console.log('✓ front_pages')

  await seedLanguages()
  console.log('✓ languages')

  await seedSettings()
  console.log('✓ settings')

  await seedTicketTaxonomy()
  console.log('✓ departments/categories/priorities/status/types')

  await seedMediaFolders()
  console.log('✓ media_folders')

  await seedNavigationMenus()
  console.log('✓ navigation_menus')

  await seedAdminUser()
  console.log('✓ admin user (admin@opsotech.com / Admin@123, role_id=1)')

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
