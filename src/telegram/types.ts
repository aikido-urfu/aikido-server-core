export const TelegramId = {
  schema: {
    type: 'object',
    properties: {
      tgid: {
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
      tgid: {
        type: 'string',
      },
      token: {
        type: 'string',
      },
    },
  },
};
