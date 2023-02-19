import "./Color.css";

function C({ children, change }) {
  if (change > 0) {
    return <span className="color-bk-green">{children}</span>;
  } else {
    return <span className="color-bk-red">{children}</span>;
  }
}

function Red({ children }) {
  return <span className="color-red">{children}</span>;
}

function Green({ children }) {
  return <span className="color-green">{children}</span>;
}

const Color = {
  Red,
  Green,
  C,
};

export default Color;
