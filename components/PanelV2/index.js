import React from 'react';
import BigCalendar from 'react-big-calendar';
import { map } from 'lodash';
import moment from 'moment';
import api from './../../api_client';

import Clock from './../Clock';
import Forecast from './../Forecast';
import ListEvents from './../ListEvents';


import styles from './_index.scss';

// helpers
const METAR_REFRESH_INTERVAL = 1000 * 60 * 15; // 15 minutes
const GCAL_REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes
const getClientId = () => {
  console.log('LOCAL?', window.localStorage);
  if (window.localStorage) {
    return window.localStorage.clientId;
  } else {
    return document.cookie.replace(/(?:(?:^|.*;\s*)clientId\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  }
}

const setClientId = (id) => {
  if (window.localStorage) {
    window.localStorage.clientId = id;
  } else {
    document.cookie = `clientId=${id}`;
  }
}

const TIME_MANAGER = {
  tId: 0,
  listeners: [],
  interval: 30000, // tick interval in ms
  lastRun: moment(),
};
const runTick = () => {
  console.log('TICK');
  TIME_MANAGER.listeners.forEach(l => {
    console.log('run tick', TIME_MANAGER.interval);
    console.log(moment() - l.lastRun, l.interval);
    if (moment() - l.lastRun >= l.interval) {
      console.log('call action', l);
      l.action();
      l.lastRun = moment();
    }
  });

  if (TIME_MANAGER.lastRun.format('DD') !== moment().format('DD')) {
    console.log('RELOAD BY DAY CHANGE');
    window.location.reload(true);
  }

  TIME_MANAGER.lastRun = moment();
};
const startTick = () => TIME_MANAGER.tId = setInterval(runTick, TIME_MANAGER.interval);
const stopTick = () => clearInterval(TIME_MANAGER.tId);
const addTickListener = (l, interval = TIME_MANAGER.interval) => {
  TIME_MANAGER.listeners = [...TIME_MANAGER.listeners, {
    lastRun: moment(),
    action: l,
    interval,
  }];
};
// =========

class PanelV2 extends React.Component {
  state = {
    status: 'unknown',
    calendarEvents: [],
    avweather: [],
    clientId: '',
  }

  componentDidMount() {
    const clientId = getClientId();
    if (!clientId) {
      this.register();
    } else {
      this._saveClientId(clientId);
    }

    startTick();
    addTickListener(() => this._loadMetar(), METAR_REFRESH_INTERVAL);
    addTickListener(() => this._loadCalendarEvents, GCAL_REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    stopTick();
  }

  _saveClientId = (clientId) => {
    this.setState({ clientId });
    setClientId(clientId);
    this._getConfig();
  }

  register = async () => {
    this.setState({ status: 'busy' });
    try {
      const r = await api.register();
      if (r.ok) {
        this._saveClientId(r.clientId);
      } else {
        console.log('server response not ok:', r);
      }
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error', error: e.message });
    }
  }

  _getConfig = async () => {
    this.setState({ status: 'busy' });
    try {
      const r = await api.getConfigs(getClientId());
      if (r.ok) {
        if (Object.keys(r.configs).length) {
          this.setState({ status: 'configured' });
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
          console.log('sin config');
          this.setState({ status: 'unconfigured' });
        }
      } else {
        console.log('server response not ok:', r);
      }
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error', error: e.message });
    }
  }

  _loadMetar = async () => {
    const r = await api.getMetar(getClientId());
    try {
      if (r.ok) {
        console.log(r.data);
        this.setState({
          avweather: r.data,
        });
      } else {
        console.log('server response not ok:', r);
      }
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error', error: e.message });
    }
  }

  _loadCalendarEvents = async () => {
    const r = await api.getCalendarEvents(getClientId());
    try {
      if (r.ok) {
        this.setState({
          calendarEvents: map(r.events, (gce) => {
            const allDay = gce.start.date && !gce.start.dateTime;
            const startDate = moment(gce.start.date || gce.start.dateTime).format();
            const endDate = moment(gce.end.date || gce.end.dateTime).format();
            return {
              title: gce.summary,
              allDay,
              start: startDate,
              end: endDate,
            }
          }),
        });
      } else {
        console.log('server response not ok:', r);
      }
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error', error: e.message });
    }
  }

  render() {
    return (
      <div className="panel-root">
        <section>{/* UPPER HALF */}
          <column className="box">

            <div className="forecast-container">
              <Forecast lat={-32.0967} lon={-63.7941} name='Córdoba' units="ca" height="100%" />
            </div>
          
          </column>
          <column className="box">
            
            <article>
              <p className="title"><b>AVIATION WEATHER</b></p>
              {map(this.state.avweather.metars, (metar, airportCode) => {
                const taf = this.state.avweather.tafs[airportCode];
                return (
                  <div className="avw-content" key={airportCode}>
                    {map(metar, (m, i) => (<p key={`${airportCode}${i}`}>{m}</p>))}
                    <br />
                    <p>{taf}</p>
                    <hr />
                  </div>
                )
              })}
            </article>

          </column>
        </section>
        <section>{/* BOTTOM HALF */}
          <column className="box">
            <BigCalendar
              toolbar={false}
              events={this.state.calendarEvents}
            />
          </column>
          <column className="box">
            
            <section>
              <column className="box">
                <a
                  className="button is-white"
                  href={`${process.env.STORYBOOK_SERVER_URL}/config/${this.state.clientId}`}
                  target="_blank"
                >
                  {`${process.env.STORYBOOK_SERVER_URL}/config/${this.state.clientId}`}
                </a>
                <span>status: {this.state.status}</span>
              </column>
              <column className="box">
                <Clock className="digital-clock" />
              </column>
            </section>

            <section>
              <column className="box">
                <ListEvents events={ this.state.calendarEvents } />
              </column>
            </section>
          </column>
        </section>
      </div>
    );
  }
}

export default PanelV2
