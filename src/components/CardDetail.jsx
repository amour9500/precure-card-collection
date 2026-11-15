function Counter({ label, value, onChange }) {
  return <div className="counterRow"><span>{label}</span><div className="counterControls"><button onClick={() => onChange(Math.max(0, value - 1))} aria-label={`${label}を1枚減らす`}>−</button><b>{value}枚</b><button onClick={() => onChange(value + 1)} aria-label={`${label}を1枚増やす`}>＋</button></div></div>;
}

export default function CardDetail({ card, state, onBack, onSetCount, onToggleFavorite }) {
  const isGummy = card.category === 'gummy';
  const ownedCount = Number(state.ownedCount ?? (state.owned ? 1 : 0));
  const unopenedCount = Number(state.unopenedCount ?? 0);
  const openedCount = Number(state.openedCount ?? (state.owned ? 1 : 0));
  const total = isGummy ? ownedCount : unopenedCount + openedCount;
  return <section>
    <div className="detailHead"><button onClick={onBack}>← 戻る</button><h2>カード詳細</h2></div>
    <div className="detailImage">{card.imageUrl ? <img src={card.imageUrl} alt={card.name}/> : <>カード画像</>}</div>
    <dl>{[['排出弾',card.release],['カード番号',card.cardNo],['レアリティ',card.rarity],['カード名',card.name],['シリーズ',card.series]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    <div className="quantityPanel"><h3>所持枚数 <strong>合計 {total}枚</strong></h3>
      {isGummy
        ? <Counter label="所持枚数" value={ownedCount} onChange={value => onSetCount('ownedCount', value)}/>
        : <><Counter label="未開封" value={unopenedCount} onChange={value => onSetCount('unopenedCount', value)}/><Counter label="開封済み" value={openedCount} onChange={value => onSetCount('openedCount', value)}/></>}
    </div>
    <button className="wide" onClick={onToggleFavorite}>{state.favorite ? '★ お気に入り解除' : '☆ お気に入り登録'}</button>
  </section>;
}
