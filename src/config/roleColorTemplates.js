// Шаблоны цветов для ролей
export const roleColorTemplates = [
  { id: 'red', name: 'Красный', color: '#FF0000', gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)' },
  { id: 'pink', name: 'Розовый', color: '#FF69B4', gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)' },
  { id: 'purple', name: 'Фиолетовый', color: '#8A2BE2', gradient: 'linear-gradient(135deg, #8A2BE2 0%, #6A1BB2 100%)' },
  { id: 'blue', name: 'Синий', color: '#4169E1', gradient: 'linear-gradient(135deg, #4169E1 0%, #1E40AF 100%)' },
  { id: 'cyan', name: 'Голубой', color: '#00CED1', gradient: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)' },
  { id: 'green', name: 'Зеленый', color: '#32CD32', gradient: 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)' },
  { id: 'yellow', name: 'Желтый', color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
  { id: 'orange', name: 'Оранжевый', color: '#FF8C00', gradient: 'linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)' },
  { id: 'gold', name: 'Золотой', color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)' },
  { id: 'silver', name: 'Серебряный', color: '#C0C0C0', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)' },
  { id: 'white', name: 'Белый', color: '#FFFFFF', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)' },
  { id: 'dark-blue', name: 'Темно-синий', color: '#00008B', gradient: 'linear-gradient(135deg, #00008B 0%, #000050 100%)' },
]

// Права доступа для ролей
export const rolePermissions = [
  { id: 'accept_requests', name: 'Принимать заявки', description: 'Принимать заявки от игроков на вступление в гильдию' },
  { id: 'kick_members', name: 'Исключать', description: 'Исключать участников из гильдии' },
  { id: 'change_member_roles', name: 'Изменять роль участников', description: 'Изменять роли участников гильдии' },
  { id: 'manage_roles', name: 'Создавать, редактировать и удалять роли', description: 'Создавать новые роли, редактировать существующие и удалять кастомные роли' },
  { id: 'manage_guild_settings', name: 'Изменять настройки гильдии', description: 'Изменять название, описание и другие настройки гильдии' },
  { id: 'view_guild_balance', name: 'Видеть баланс GP и Кристаллов', description: 'Видеть сколько кристаллов и GP на счету гильдии' },
  { id: 'spend_gp', name: 'Тратить GP в магазине гильдии', description: 'Покупать товары в магазине гильдии за очки гильдии (GP)' },
  { id: 'spend_crystals', name: 'Тратить Кристаллы в магазине гильдии', description: 'Покупать товары в магазине гильдии за кристаллы' },
  { id: 'send_chat_messages', name: 'Отправлять сообщения в чат гильдии', description: 'Отправлять сообщения в чат гильдии' },
  { id: 'delete_chat_messages', name: 'Удалять сообщения в чате гильдии', description: 'Удалять сообщения других участников в чате гильдии' },
  { id: 'upgrade_talents', name: 'Прокачивать таланты гильдии', description: 'Прокачивать таланты гильдии, используя ресурсы гильдии' },
]

