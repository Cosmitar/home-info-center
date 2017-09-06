import React from 'react';
import Clock from './../Clock';
import IframeGCalEmbed from './../IframeGCalEmbed';
import Forecast from './../Forecast';
import './_index.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class PanelV1 extends React.Component {
  render() {
    const eventsList = [{
      'title': 'All Day Event',
      // 'allDay': true,
      'start': new Date(2017, 9, 0),
      'end': new Date(2017, 9, 1)
    },
    {
      'title': 'Long Event',
      'start': new Date(2017, 9, 7),
      'end': new Date(2017, 9, 10)
    }];
    return (
      <div className="tile is-ancestor" style={{ width: 900, height: 1440, border: '1px solid black' }}>
        <div className="tile is-vertical is-12">
          <div className="tile">
            <div className="tile is-parent is-vertical">
              <article className="tile is-child panel-center-content" style={{ backgroundColor: 'transparent' }}>
                <Clock className="digital-clock"/>
              </article>
              <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
                <Forecast lat={-32.0967} lon={-63.7941} name='Córdoba' units="ca" />
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child notification" style={{ backgroundColor: '#fb0' }}>
                <p class="title">Notes</p>
              </article>
            </div>
          </div>
          <div className="tile is-parent">
            <article
              className="tile is-child is-calendar"
              style={{
                backgroundColor: 'transparent',
                height: 'auto'
              }}
            >
              <BigCalendar
                views=""
                toolbar={false}
                events={eventsList}
                startAccessor='startDate'
                endAccessor='endDate'
              />
            </article>
          </div>
        </div>
      </div>
    );
  }
}

export default PanelV1;
