const handler = [window.location.origin, window.location.pathname].join('');

export default (isAdmin: boolean) => ({
  initParams(): TRequests {
    const options: TRequests = {
      info: ['app.info'],
      user: ['user.current'],
      users: [
        'user.get',
        {
          FILTER: {
            USER_TYPE: 'employee',
          },
        },
      ],
      department: {
        method: 'user.get',
        params: {
          FILTER: {
            USER_TYPE: 'employee',
            UF_DEPARTMENT: '$result[user][UF_DEPARTMENT]',
          },
        },
      },
    };

    if (isAdmin) {
      return {
        ...this.placementList(),
        ...options,
      };
    }

    return options;
  },

  placementList(): TRequests {
    return {
      placementList: ['placement.get'],
    };
  },

  placementBind(placement: string, name: string): TRequests {
    return {
      placementBind: {
        method: 'placement.bind',
        params: {
          PLACEMENT: placement,
          HANDLER: handler,
          LANG_ALL: {
            ru: {
              TITLE: name,
            },
          },
        },
      },
      ...this.placementList(),
    };
  },

  placementUnbind(placement: string): TRequests {
    return {
      placementUnbind: {
        method: 'placement.unbind',
        params: {
          PLACEMENT: placement,
          HANDLER: handler,
        },
      },
      ...this.placementList(),
    };
  },
});
