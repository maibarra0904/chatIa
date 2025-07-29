import PropTypes from 'prop-types';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function WazeMap({ lat, lng }) {
  const wazeUrl = `https://embed.waze.com/iframe?zoom=15&lat=${lat}&lon=${lng}&pin=1`;

  return (
    <div style={containerStyle}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={wazeUrl}
        allowFullScreen
        title="Waze Map"
      ></iframe>
    </div>
  );
}

WazeMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default WazeMap;
