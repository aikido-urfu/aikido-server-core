export const PostMail = {
  schema: {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
      },
      receivers: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
      text: {
        type: 'string',
      },
      files: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
          },
        },
      },
      photos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const GetMail = {
  schema: {
    type: 'object',
    properties: {
      mails: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            isReaden: {
              type: 'boolean',
            },
            date: {
              type: 'string',
            },
            theme: {
              type: 'string',
            },
            recievers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                },
              },
            },
            text: {
              type: 'string',
            },
            files: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            photos: {
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
