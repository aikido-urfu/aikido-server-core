export const TelegramId = {
  schema: {
    type: 'object',
    properties: {
      telegramUserID: {
        type: 'string',
      },
    },
  },
};

export const Votes = {
  schema: {
    type: 'object',
    properties: {
      votes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const Start = {
  schema: {
    type: 'object',
    properties: {
      telegramUserID: {
        type: 'string',
      },
      token: {
        type: 'string',
      },
    },
  },
};

export const Token = {
  schema: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
      },
    },
  },
};

export const ExpiredPeriod = {
  schema: {
    type: 'object',
    properties: {
      period: {
        type: 'number',
      },
    },
  },
};

export const GetExpiredVotes = {
  schema: {
    type: 'object',
    propetries: {
      votes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            title: {
              type: 'string',
            },
            tgUserIds: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export const GetExpiringVotes = {
  schema: {
    type: 'object',
    propetries: {
      votes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            title: {
              type: 'string',
            },
            tgUserIds: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            endDate: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};