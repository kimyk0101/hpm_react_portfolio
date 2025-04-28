const TrailDetails = ({ mountainName, cardInfo }) => {
  return (
    <div className="card-details">
      <p>
        <strong>{mountainName}</strong>
      </p>
      <p className="trail-course">{cardInfo.name}</p>
      <div className="trail-meta">
        <span>{cardInfo.distance}</span>
        <span>{cardInfo.time}</span>
        <span>{cardInfo.level}</span>
      </div>
    </div>
  );
};

export default TrailDetails;
