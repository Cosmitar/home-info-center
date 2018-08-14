import React from 'react';
import moment from 'moment';

export default ({ events, ignorePast }) => (
  <ul>
    {
      events
        .filter(e => (ignorePast && moment(e.start) > moment()))
        .map(e => {
        const diff = moment() - moment(e.start).add(1, 'day');
        const humanDiff = `${diff < 0 ? 'en' : 'hace'} ${moment.duration(diff).locale('es').humanize()}`;
        return (
          <li key={ e.id }>
            { `${e.title} - ${moment(e.start).locale('es').format("dddd D [de] MMMM [de] YYYY, h:mm:ss a")}` }
          </li>
        );
      })
    }
  </ul>
);
