function Celebrate({  hi }) {
  let v = hi;
  console.log(v);
  return <p>{v} 🎉🎉🎉</p>
}

ReactDOM.render(
  <Celebrate hi="Hello Babel!" />,
  document.getElementById('root'),
)
