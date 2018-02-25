import React from 'react';
import Clock from './../Clock';
import IframeGCalEmbed from './../IframeGCalEmbed';
import Forecast from './../Forecast';
import './_index.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import api from './../../api_client';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
// console.log(process.env);
class PanelV1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'unknown',
      clientId: '',
      calendarEvents: [],
      metars: [],
    };

    this._refreshData = this._refreshData.bind(this);
  }

  componentWillMount() {
    if (!localStorage.clientId) {
      this._register();
    } else {
      this.setState({ clientId: localStorage.clientId });
      setTimeout(this._getConfig.bind(this), 0);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  _register() {
    this.setState({ status: 'busy' });
    api.register().then((r) => {
      if (r.ok) {
        localStorage.clientId = r.clientId;
        setTimeout(this._getConfig.bind(this), 0);
        this.setState({ status: 'registered', clientId: localStorage.clientId });
      } else {
        this.setState({ status: r.error });
      }
    });
  }

  _refreshData() {
    if (this.state.status === 'config ready') {
      this._getConfig();
    }
  }

  _getConfig() {
    this.setState({ status: 'busy' });
    api.getConfigs(localStorage.clientId).then((r) => {
      if (r.ok) {
        // console.log(r.configs);
        if (Object.keys(r.configs).length) {
          this.setState({ status: 'config ready' });
          if (!this.intervalId) {
            this.intervalId = setInterval(this._refreshData, 1000 * 30);
          }

          if (r.configs['gcalendar']) {
            this._loadCalendarEvents();
          }
          if (r.configs['metar'] || true) {
            this._loadMetar()
          }
        } else {
          this.setState({ status: 'unconfigured terminal.' });
        }
      } else {
        this.setState({ status: r.error });
      }
    });
  }

  _loadMetar() {
    api.getMetar(localStorage.clientId).then((r) => {
      if (r.ok) {
        console.log(r.data);
        this.setState({
          metars: r.data,
        });
      }
    });
  }

  _loadCalendarEvents() {
    api.getCalendarEvents(localStorage.clientId).then((r) => {
      if (r.ok) {
        this.setState({
          calendarEvents: r.events.map((gce) => {
            return {
              title: gce.summary,
              allDay: gce.start.date && !gce.start.dateTime,
              start: new Date(Date.parse(gce.start.date || gce.start.dateTime)),
              end: new Date(Date.parse(gce.end.date || gce.end.dateTime)),
            }
          }),
        });
      }
    });
  }

  render() {
    // style={{ width: 900, height: 1440, border: '1px solid black' }}
    return (
      <div className="tile is-ancestor" style={{ minHeight: 1440 }}>
        <div className="tile is-vertical is-12">
          <div className="tile">
            <div className="tile is-parent is-vertical">
              <div className="tile is-parent is-vertical" style={{ backgroundColor: 'transparent' }}>
                <article>
                  <Clock className="digital-clock"/>
                </article>
                <article className="is-child panel-center-content">
                  <a
                    className="button is-white is-loading"
                    style={{ display: this.state.status === 'busy' ? 'block' : 'none' }}
                  >
                  ->
                  </a>
                  <a
                    className="button is-white"
                    href={`${process.env.STORYBOOK_SERVER_URL}/config/${this.state.clientId}`}
                    target="_blank"
                  >
                    {`${process.env.STORYBOOK_SERVER_URL}/config/${this.state.clientId}`}
                  </a>
                </article>
              </div>
              <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
                <Forecast lat={-32.0967} lon={-63.7941} name='Córdoba' units="ca" />
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child notification" style={{ backgroundColor: '#fb0' }}>
                <p class="title">METAR</p>
                {this.state.metars.map(info => (
                  <div style={{ marginBottom: 10 }}>
                    {info}
                  </div>))}
              </article>
            </div>
          </div>
          <div className="tile is-parent">
            <article
              className="tile is-child"
              style={{
                backgroundColor: 'transparent',
                height: 'auto'
              }}
            >
              <BigCalendar
                toolbar={false}
                events={this.state.calendarEvents}
              />
            </article>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left:0 }}>
          <p style={{ fontSize: '8px' }}>
            v{__VERSION}
          </p>
        </div>
      </div>
    );
  }
}

export default PanelV1;
