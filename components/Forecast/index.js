import React from 'react';
import PropTypes from 'prop-types';

class Forecast extends React.Component {
  static propTypes = {
    lat: PropTypes.number,
    lon: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    font: PropTypes.string,
    units: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  }

  static defaultProps = {
    lat: -31,
    lon: -60,
    name: '',
    color: '',
    font: '',
    units: 'ca',
    width: '100%',
    height: 345,
  }

  render() {
    const {
      lat,
      lon,
      name,
      color,
      font,
      units,
      width,
      height,
    } = this.props;
    const joint = '&';
    const params = [
      `lat=${lat}`,
      `lon=${lon}`,
      `name=${name}`,
      `color=${color}`,
      `font=${font}`,
      `units=${units}`,
    ].join(joint);

    return (
      <iframe
        type='text/html'
        height={height}
        width={width}
        frameBorder='0'
        src={`//forecast.io/embed/#${params}`}
      />
    );
  }
}

export default Forecast;
