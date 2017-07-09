import React from 'react';
import Clock from './../Clock';
import IframeGCalEmbed from './../IframeGCalEmbed';
import Forecast from './../Forecast';
import './_index.scss';

class PanelV1 extends React.Component {
  render() {
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
            <article className="tile is-child" style={{ backgroundColor: 'red', height: 'auto' }}>
              <IframeGCalEmbed
                src="tja6fnnfjfjnck3pbp76v3gkvg@group.calendar.google.com"
                style={{ borderWidth: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
              />
            </article>
          </div>
        </div>
      </div>
    );
  }
}

export default PanelV1;
