import React from 'react';
import Clock from './../Clock';
import IframeGCalEmbed from './../IframeGCalEmbed';
import './_index.scss';

class PanelV1 extends React.Component {
  render() {
    return (
      <div className="tile is-ancestor">
        <div className="tile is-vertical is-12">
          <div className="tile">
            <div className="tile is-parent">
              <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
                <Clock className="digital-clock"/>
              </article>
            </div>
            <div className="tile is-parent is-vertical">
              <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
              </article>
              <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
              </article>
            </div>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child" style={{ backgroundColor: 'transparent' }}>
              <IframeGCalEmbed
                src="mhherrera31@gmail.com"
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
