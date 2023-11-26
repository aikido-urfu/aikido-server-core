export const GetVote = {
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      title: {
        type: 'string',
      },
      desciption: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      isAnonymous: {
        type: 'boolean',
      },
      isActive: {
        type: 'boolean',
      },
      isHidenCounter: {
        type: 'boolean',
      },
      privateUsers: {
        type: 'array',
        items: {
          type: 'number',
        },
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
      questions: {
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
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number',
                  },
                  text: {
                    type: 'string',
                  },
                  count: {
                    type: 'number',
                  },
                },
              },
            },
            isAnonimic: {
              type: 'boolean',
            },
            isHidenCounter: {
              type: 'boolean',
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
            isMultiply: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};

export const GetVotes = {
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      title: {
        type: 'string',
      },
      desciption: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      isAnonymous: {
        type: 'string',
      },
      isActive: {
        type: 'string',
      },
      privateUsers: {
        type: 'array',
        items: {
          type: 'number',
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
};

export const PostVote = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      desciption: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      isAnonymous: {
        type: 'boolean',
      },
      isActive: {
        type: 'boolean',
      },
      isHidenCounter: {
        type: 'boolean',
      },
      privateUsers: {
        type: 'array',
        items: {
          type: 'number',
        },
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
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            answers: {
              type: 'array',
              items: {
                type: 'string',
              },
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
            isMultiply: {
              type: 'boolean',
            },
            isAnonimic: {
              type: 'boolean',
            },
            isHidenCounter: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};

export const PatchVote = {
  schema: {
    type: 'object',
    default: {
      457: 4146,
      458: 4189,
      459: 1441,
    },
  },
};
