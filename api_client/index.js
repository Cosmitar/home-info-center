const API_ENDPOINT = 'http://homeinfocenter.app/api/v1';
const dataToQueryString = (data) => {
  const vars = [];
  Object.keys(data).forEach((k) => {
    if (Array.isArray(data[k])) {
      data[k].forEach((arrItem) => {
        vars.push(`${encodeURIComponent(k)}[]=${encodeURIComponent(arrItem)}`);
      })
    } else {
      vars.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`);
    }
  });
  return vars.join('&');
};

const client = {
  register: () => {
    return fetch(`${API_ENDPOINT}/register`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      body: null,
    }).then((response) => {
      let res = response;

      if (res.status === 200) {
        res = res.json();
      }

      return res;
    });
  },
  validateCode: (code) => {
    return new Promise((resolve) => {
      const response = {
        ok: true,
        code,
      };
      setTimeout(() => resolve(response), 3000);
    });
  },
  getConfigs: (clientId) => {
    return fetch(`${API_ENDPOINT}/configs?${dataToQueryString({ clientId })}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      body: null,
    }).then((response) => {
      let res = response;

      if (res.status === 200) {
        res = res.json();
      }

      return res;
    });
  },
  getCalendarEvents: (clientId) => {
    return fetch(`${API_ENDPOINT}/terminal/${ clientId }/config/gcalendar`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      body: null,
    }).then((response) => {
      let res = response;

      if (res.status === 200) {
        res = res.json();
      }

      return res;
    });
  },
};

export default client;
