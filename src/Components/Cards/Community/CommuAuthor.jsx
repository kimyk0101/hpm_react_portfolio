const CommuAuthor = ({ author }) => {
  return (
    <div className="commu-author">
      <span className="nickname">{author.nickname}</span>
      <span className="date">{author.date}</span>
    </div>
  );
};

export default CommuAuthor;
