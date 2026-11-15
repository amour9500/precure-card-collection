export default function Stats({ total, ownedTypes, totalCopies }) {
  const rate = total ? (ownedTypes / total * 100).toFixed(1) : '0.0';
  return <div className="stats"><div><b>{total}</b><span>全種類</span></div><div><b>{ownedTypes}</b><span>所持種類</span></div><div><b>{totalCopies}</b><span>所持枚数</span></div><div><b>{rate}%</b><span>収集率</span></div></div>;
}
