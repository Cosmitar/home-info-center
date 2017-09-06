import React from 'react';
import api from './../../api_client';

export default class APITest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'unknown',
      clientId: '',
      events: [],
    };
  }

  componentWillMount() {
    if (!localStorage.clientId) {
      this._register();
    } else {
      this.setState({ clientId: localStorage.clientId });
      setTimeout(this._getConfig.bind(this), 0);
    }
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

  _getConfig() {
    this.setState({ status: 'busy' });
    api.getConfigs(localStorage.clientId).then((r) => {
      if (r.ok) {
        console.log(r.configs);
        if (Object.keys(r.configs).length) {
          this.setState({ status: 'config ready' });
          if (r.configs['gcalendar']) {
            this._loadCalendarEvents();
          }
        } else {
          this.setState({ status: 'unconfigured terminal.' });
        }
      } else {
        this.setState({ status: r.error });
      }
    });
  }

  _loadCalendarEvents() {
    api.getCalendarEvents(localStorage.clientId).then((r) => {
      if (r.ok) {
        this.setState({
          events: r.events,
        });
      }
    });
  }

  render() {
    const configLink = this.state.clientId ?
      <a href={`http://homeinfocenter.app/config/${this.state.clientId}`} target="blank">configuration link</a>
      :
      null;
    const eventLists = this.state.events.length ?
      <ul>{this.state.events.map((e) => {
        return <li key={e.id}>{e.summary}-({e.start.date})</li>
      })}</ul>
      : null;
    return (
      <div>
        <div>
          status: {this.state.status}
        </div>
        { eventLists }
        <div>
          { configLink }
        </div>
      </div>
    );
  }
};
