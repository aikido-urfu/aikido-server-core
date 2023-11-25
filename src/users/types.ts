export const UpdateUser = {
  schema: {
    type: 'object',
    properties: {
      login: {
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
      telegram: {
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
    },
  },
};
