const ProductCard = ({
  title,
  icon,
  titleColor,
  upContent = '',
  downContent = '',
  onClick,
  target,
}) => {
  return (
    <>
      <div className="card" onClick={onClick}>
        <div className="titleBox">
          <p style={{color: titleColor}}>
            {icon}
            <br />
            {title}
            {target && <p className="target">대상학년: {target}</p>}
          </p>
        </div>
        <div className="contentsBox">
          <div className="content up">
            {upContent.split('\n').map(str => {
              return <p>{str}</p>;
            })}
          </div>
          <div className="content pay">
            <button>결제하기</button>
          </div>
          <div className="content down">
            {downContent.split('\n').map(str => {
              return <p>{str}</p>;
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .card {
          width: 13rem;
          height: 21.5rem;
          margin: 1rem 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid;
          border-color: #00000040;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .titleBox {
          display: flex;
          align-items: center;
          padding: 0.4rem;
          flex: 1;
          font-weight: bolder;
        }
        .titleBox p {
          font-size: 1rem;
        }
        .titleBox .target {
          font-size: 0.55rem;
          margin: 0.4rem 0;
          font-weight: 300;
          color: #000000;
        }
        .contentsBox {
          flex: 3;
          display: flex;
          flex-direction: column;
          background-color: #f4efe1;
        }
        .content {
          padding: 0.5rem;
          font-weight: bold;
          flex: 1;
        }
        .content.up p {
          font-size: 1rem;
        }
        .content.pay {
          flex: 0.4;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card:hover .pay button {
          background-color: orange;
          color: white;
        }
        .content button {
          border: 1px solid;
          color: orange;
          width: 100%;
          border-radius: 0.3rem;
          padding: 0.2rem 0;
          font-weight: bold;
          transition: 300ms;
          font-size: 1rem;
        }
        .content.down p {
          font-size: 1rem;
          font-weight: 400;
        }
        @media (max-width: 840px) {
          .card {
            width: 40vw;
            height: 80vw * 1.63;
          }
        }
      `}</style>
    </>
  );
};

export default ProductCard;
