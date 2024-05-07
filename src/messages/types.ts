export const PostMessage = {
    schema: {
      type: 'object',
      properties: {
        voteId: {
          type: 'number',
        },
        text: {
          type: 'string',
        },
        isRef: {
          type: 'boolean',
        },
        refComId: {
          type: 'number',
        },
      },
    },
  };