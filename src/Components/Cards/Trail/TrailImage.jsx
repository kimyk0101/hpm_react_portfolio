const TrailImage = ({ image, mountainName }) => {
  return (
    <div className="image-area">
      <img src={image} alt={mountainName} className="image" />
    </div>
  );
};

export default TrailImage;
