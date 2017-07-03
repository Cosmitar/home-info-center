import React from 'react';
import PropTypes from 'prop-types';

class IframeGCalEmbed extends React.Component {
  static propTypes = {
    showTitle: PropTypes.number,
    showNav: PropTypes.number,
    showDate: PropTypes.number,
    showPrint: PropTypes.number,
    showTabs: PropTypes.number,
    showCalendars: PropTypes.number,
    showTz: PropTypes.number,
    height: PropTypes.string,
    wkst: PropTypes.number,
    bgcolor: PropTypes.string,
    src: PropTypes.string,
    color: PropTypes.string,
  };

  static defaultProps = {
    showTitle: 0,
    showNav: 0,
    showDate: 0,
    showPrint: 0,
    showTabs: 0,
    showCalendars: 0,
    showTz: 0,
    height: '600',
    wkst: 1,
    bgcolor: '#FFFFFF',
    src: '',
    color: '#8C500B',
  };

  render() {
    const {
      showTitle,
      showNav,
      showDate,
      showPrint,
      showTabs,
      showCalendars,
      showTz,
      height,
      wkst,
      bgcolor,
      src,
      color,
      ...iframe_props,
    } = this.props;

    const joint = '&';
    const srcParams = [
      `showTitle=${showTitle}`,
      `showNav=${showNav}`,
      `showDate=${showDate}`,
      `showPrint=${showPrint}`,
      `showTabs=${showTabs}`,
      `showCalendars=${showCalendars}`,
      `showTz=${showTz}`,
      `height=${height}`,
      `wkst=${wkst}`,
      `bgcolor=${encodeURIComponent(bgcolor)}`,
      `src=${encodeURIComponent(src)}`,
      `color=${encodeURIComponent(color)}`,
    ].join(joint);

    return (
      <iframe
        src={`https://calendar.google.com/calendar/embed?${srcParams}`}
        {...iframe_props} height={height}
      ></iframe>
    );
  }
}

export default IframeGCalEmbed;
