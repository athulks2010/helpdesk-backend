import { User, initUserModel } from './user/user.model'
import { PendingUser, initPendingUserModel } from './user/pending-user.model'
import { Role, initRoleModel } from './role/role.model'
import { Ticket, initTicketModel } from './ticket/ticket.model'
import { Comment, initCommentModel } from './ticket/comment.model'
import { Attachment, initAttachmentModel } from './ticket/attachment.model'
import { Conversation, initConversationModel } from './conversation/conversation.model'
import { Message, initMessageModel } from './conversation/message.model'
import { Participant, initParticipantModel } from './conversation/participant.model'
import { MessageAttachment, initMessageAttachmentModel } from './conversation/message-attachment.model'
import { Notification, initNotificationModel } from './notification/notification.model'
import { Contact, initContactModel } from './contact/contact.model'
import { Status, initStatusModel } from './status/status.model'
import { Priority, initPriorityModel } from './priority/priority.model'
import { Department, initDepartmentModel } from './department/department.model'
import { Type, initTypeModel } from './type/type.model'
import { Category, initCategoryModel } from './category/category.model'
import { initPersonalAccessTokenModel } from './auth/personal-access-token.model'
import { initPasswordResetModel } from './auth/password-reset.model'
import { Organization, initOrganizationModel } from './organization/organization.model'
import { initSettingModel } from './setting/setting.model'
import { initFaqModel } from './faq/faq.model'
import { initPostModel } from './post/post.model'
import { KnowledgeBase, initKnowledgeBaseModel } from './knowledge-base/knowledge-base.model'
import { initEmailTemplateModel } from './email-template/email-template.model'
import { initLanguageModel } from './language/language.model'
import { initNoteModel } from './note/note.model'
import { initServiceModel } from './service/service.model'
import { initFrontPageModel } from './front-page/front-page.model'
import { initNavigationMenuModel } from './navigation-menu/navigation-menu.model'
import { Country, initCountryModel } from './country/country.model'

/** Initialize Sequelize models and wire associations. Call after dbConnection(). */
export async function initAllModels() {
  initRoleModel()
  initUserModel()
  initPendingUserModel()
  initPersonalAccessTokenModel()
  initPasswordResetModel()

  initOrganizationModel()
  initContactModel()
  initStatusModel()
  initPriorityModel()
  initDepartmentModel()
  initTypeModel()
  initCategoryModel()

  initTicketModel()
  initCommentModel()
  initAttachmentModel()

  initConversationModel()
  initMessageModel()
  initParticipantModel()
  initMessageAttachmentModel()

  initNotificationModel()
  initSettingModel()
  initFaqModel()
  initPostModel()
  initKnowledgeBaseModel()
  initEmailTemplateModel()
  initLanguageModel()
  initNoteModel()
  initServiceModel()
  initFrontPageModel()
  initNavigationMenuModel()
  initCountryModel()

  // Associations
  Contact.belongsTo(Country, { as: 'countryDetails', foreignKey: 'country', targetKey: 'id' })
  Country.hasMany(Contact, { as: 'contacts', foreignKey: 'country', sourceKey: 'id' })
  Organization.belongsTo(Country, { as: 'countryDetails', foreignKey: 'country', targetKey: 'id' })
  Country.hasMany(Organization, { as: 'organizations', foreignKey: 'country', sourceKey: 'id' })

  Contact.belongsTo(Organization, { as: 'organization', foreignKey: 'organization_id' })
  Organization.hasMany(Contact, { as: 'contacts', foreignKey: 'organization_id' })

  User.belongsTo(Role, { as: 'role', foreignKey: 'role_id' })
  Role.hasMany(User, { as: 'users', foreignKey: 'role_id' })

  Ticket.belongsTo(User, { as: 'user', foreignKey: 'user_id' })
  Ticket.belongsTo(User, { as: 'assignedTo', foreignKey: 'assigned_to' })
  Ticket.belongsTo(User, { as: 'createdBy', foreignKey: 'created_by' })
  Ticket.belongsTo(Contact, { as: 'contact', foreignKey: 'contact_id' })
  Ticket.belongsTo(Status, { as: 'status', foreignKey: 'status_id' })
  Ticket.belongsTo(Priority, { as: 'priority', foreignKey: 'priority_id' })
  Ticket.belongsTo(Department, { as: 'department', foreignKey: 'department_id' })
  Ticket.belongsTo(Type, { as: 'type', foreignKey: 'type_id' })
  Ticket.belongsTo(Category, { as: 'category', foreignKey: 'category_id' })

  Ticket.hasMany(Comment, { as: 'comments', foreignKey: 'ticket_id' })
  Comment.belongsTo(Ticket, { as: 'ticket', foreignKey: 'ticket_id' })
  Comment.belongsTo(User, { as: 'user', foreignKey: 'user_id' })
  Comment.belongsTo(Contact, { as: 'contact', foreignKey: 'contact_id' })

  Ticket.hasMany(Attachment, { as: 'attachments', foreignKey: 'ticket_id' })
  Attachment.belongsTo(Ticket, { as: 'ticket', foreignKey: 'ticket_id' })

  Conversation.hasMany(Message, { as: 'messages', foreignKey: 'conversation_id' })
  Message.belongsTo(Conversation, { as: 'conversation', foreignKey: 'conversation_id' })
  Conversation.hasMany(Participant, { as: 'participants', foreignKey: 'conversation_id' })
  Participant.belongsTo(Conversation, { as: 'conversation', foreignKey: 'conversation_id' })
  Message.hasMany(MessageAttachment, { as: 'attachments', foreignKey: 'message_id' })
  MessageAttachment.belongsTo(Message, { as: 'message', foreignKey: 'message_id' })

  KnowledgeBase.belongsTo(Type, { as: 'type', foreignKey: 'type_id' })

  return {
    User,
    PendingUser,
    Role,
    Ticket,
    Comment,
    Attachment,
    Conversation,
    Message,
    Participant,
    MessageAttachment,
    Notification,
    Contact,
    Status,
    Priority,
    Department,
    Type,
    Category,
  }
}
