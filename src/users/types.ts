export const UpdateUser = {
  schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      telegramUserID: {
        type: 'string',
      },
      photo: {
        type: 'string',
      },
    },
  },
};

export const GetUsers = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        login: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        photo: {
          type: 'string',
        },
      },
    },
  },
};

export const GetUser = {
  schema: {
    type: 'object',
    properties: {
      login: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      photo: {
        type: 'string',
      },
    },
  },
};

export const GetMe = {
  schema: {
    type: 'object',
    properties: {
      login: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      photo: {
        type: 'string',
      },
    },
  },
};

export const GetKey = {
  schema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
      },
    },
  },
};
