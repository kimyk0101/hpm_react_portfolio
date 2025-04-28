const CommuContent = ({ content }) => {
  const preview = content.length > 60 ? content.slice(0, 60) + "..." : content;

  return <p className="commu-content">{preview}</p>;
};

export default CommuContent;
