function getCounts(card, state) {
  if (['gummy', 'sikishi', 'clearcard'].includes(card.category)) {
    const total = Number(state.ownedCount ?? (state.owned ? 1 : 0));
    return { total, label: `所持 ${total}枚` };
  }
  const unopened = Number(state.unopenedCount ?? 0);
  const opened = Number(state.openedCount ?? (state.owned ? 1 : 0));
  return { total: unopened + opened, label: `未開封 ${unopened}枚 / 開封済み ${opened}枚` };
}

export default function CardGrid({ cards, states, onSelect }) {
  if (!cards.length) return <p className="empty">条件に一致するカードがありません</p>;
  return <div className="grid">{cards.map(card => {
    const state = states[card.id] || {};
    const counts = getCounts(card, state);
    return <article className="card" key={card.id} onClick={() => onSelect(card)}>
      <div className="imageBox">{card.imageUrl ? <img src={card.imageUrl} alt={card.name}/> : <span>画像未登録</span>}</div>
      <div className="body">
        <div className="badges"><span>{card.rarity}</span><span>{card.cardNo}</span></div>
        <h3>{card.name}</h3><small>{card.release}<br/>{card.series}</small>
        <div className={counts.total > 0 ? 'countDisplay ownedCount' : 'countDisplay'}><b>合計 {counts.total}枚</b><span>{counts.label}</span></div>
      </div>
    </article>;
  })}</div>;
}
