export const GetVote = {
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      userId: {
        type: 'number',
      },
      isAdmin: {
        type: 'string',
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          fullName: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
          photo: {
            type: 'string',
          },
          telegram: {
            type: 'string',
          },
          telegramUserID: {
            type: 'string',
          },
        },
      },
      isVoted: {
        type: 'boolean',
      },
      votedUsers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            fullName: {
              type: 'string',
            },
            photo: {
              type: 'string',
            },
          },
        },
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      dateOfStart: {
        type: 'string',
      },
      dateOfEnd: {
        type: 'string',
      },
      creationDate: {
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
          type: 'object',
          properties: {
            id: {
              default: 'url',
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
            id: {
              default: 'url',
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
                  votedUsers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'number',
                        },
                        fullName: {
                          type: 'string',
                        },
                        photo: {
                          type: 'string',
                        },
                      },
                    },
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
                type: 'object',
                properties: {
                  id: {
                    default: 'url',
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
                  id: {
                    default: 'url',
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
      votes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            userId: {
              type: 'number',
            },
            title: {
              type: 'string',
            },
            description: {
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
                type: 'object',
                properties: {
                  id: {
                    default: 'url',
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
      description: {
        type: 'string',
      },
      dateOfStart: {
        type: 'string',
      },
      dateOfEnd: {
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
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            description: {
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
