import {useEffect,useMemo,useState} from 'react';
import {CATEGORIES} from './data/categories';
import {CARD_MASTER} from './data/cardMaster';
import {CATEGORY_OPTIONS, SERIES_OPTIONS} from './data/categoryOptions';
import {getAllCardStates,saveCardState,replaceAllCardStates} from './db/indexedDB';
import CategoryTabs from './components/CategoryTabs';import Stats from './components/Stats';import FilterPanel from './components/FilterPanel';import CardGrid from './components/CardGrid';import CardDetail from './components/CardDetail';import Settings from './components/Settings';import ReleaseProgress from './components/ReleaseProgress';
const initialFilters={query:'',release:'',rarity:'',series:'',ownedOnly:false,unownedOnly:false,favoriteOnly:false};
const countFor=(card,state={})=>card.category==='gummy'?Number(state.ownedCount??(state.owned?1:0)):Number(state.unopenedCount??0)+Number(state.openedCount??(state.owned?1:0));
export default function App(){
 const[category,setCategory]=useState('wafer');const[states,setStates]=useState({});const[filters,setFilters]=useState(initialFilters);const[screen,setScreen]=useState('list');const[selected,setSelected]=useState(null);const[cardPage,setCardPage]=useState(0);const[releasePage,setReleasePage]=useState(0);
 useEffect(()=>{getAllCardStates().then(rows=>setStates(Object.fromEntries(rows.map(x=>[x.cardId,x]))))},[]);
 const categoryCards=useMemo(()=>CARD_MASTER.filter(c=>c.category===category),[category]);
 const options=useMemo(()=>({releases:CATEGORY_OPTIONS[category].releases,rarities:CATEGORY_OPTIONS[category].rarities,series:SERIES_OPTIONS}),[category]);
 const filteredCards=categoryCards.filter(c=>{const s=states[c.id]||{};const owned=countFor(c,s)>0;const q=filters.query.toLowerCase();return(!q||[c.name,c.cardNo,c.series].join(' ').toLowerCase().includes(q))&&(!filters.release||c.release===filters.release)&&(!filters.rarity||c.rarity===filters.rarity)&&(!filters.series||c.series===filters.series)&&(!filters.ownedOnly||owned)&&(!filters.unownedOnly||!owned)&&(!filters.favoriteOnly||s.favorite)});
 const cardPageCount=Math.max(1,Math.ceil(filteredCards.length/50));
 useEffect(()=>{setCardPage(0)},[category,filters]);
 const cards=filteredCards.slice(cardPage*50,cardPage*50+50);
 const releaseGroups=options.releases.map(release=>{const list=categoryCards.filter(c=>c.release===release);const owned=list.filter(c=>countFor(c,states[c.id])>0).length;return {release,total:list.length,owned,rate:list.length?owned/list.length*100:0}});
 const releasePageCount=Math.max(1,Math.ceil(releaseGroups.length/6));
 const visibleReleaseGroups=releaseGroups.slice(releasePage*6,releasePage*6+6);
 async function patch(id,changes){const next={cardId:id,favorite:false,memo:'',...(states[id]||{}),...changes};delete next.owned;setStates(v=>({...v,[id]:next}));await saveCardState(next)}
 function setCount(id,key,value){patch(id,{[key]:Math.max(0,Math.floor(Number(value)||0))})}
 function toggleFavorite(id){patch(id,{favorite:!states[id]?.favorite})}
 async function restore(rows){await replaceAllCardStates(rows);setStates(Object.fromEntries(rows.map(x=>[x.cardId,x])));alert('復元しました')}
 const ownedTypes=categoryCards.filter(c=>countFor(c,states[c.id])>0).length;
 const totalCopies=categoryCards.reduce((sum,c)=>sum+countFor(c,states[c.id]),0);
 return <div className="app"><header><h1>プリキュア コレクション</h1><p>カード・シール管理アプリ</p></header><CategoryTabs categories={CATEGORIES} value={category} onChange={v=>{setCategory(v);setSelected(null);setScreen('list');setFilters(initialFilters);setCardPage(0);setReleasePage(0)}}/><main>{selected?<CardDetail card={selected} state={states[selected.id]||{}} onBack={()=>setSelected(null)} onSetCount={(key,value)=>setCount(selected.id,key,value)} onToggleFavorite={()=>toggleFavorite(selected.id)}/>:screen==='settings'?<Settings states={states} onRestore={restore}/>:<><Stats total={categoryCards.length} ownedTypes={ownedTypes} totalCopies={totalCopies}/><ReleaseProgress groups={visibleReleaseGroups} page={releasePage} pageCount={releasePageCount} onPage={setReleasePage}/><FilterPanel filters={filters} setFilters={setFilters} options={options}/><div className="result"><b>{CATEGORIES.find(c=>c.id===category)?.name}</b><span>{filteredCards.length}件中 {filteredCards.length?cardPage*50+1:0}～{Math.min((cardPage+1)*50,filteredCards.length)}件</span></div><CardGrid cards={cards} states={states} onSelect={setSelected}/>{cardPageCount>1&&<div className="pager"><button disabled={cardPage===0} onClick={()=>setCardPage(cardPage-1)}>← 前の50枚</button><span>{cardPage+1} / {cardPageCount}</span><button disabled={cardPage>=cardPageCount-1} onClick={()=>setCardPage(cardPage+1)}>次の50枚 →</button></div>}</>}</main><nav><button className={screen==='list'?'active':''} onClick={()=>{setScreen('list');setSelected(null)}}>▦<span>カード一覧</span></button><button onClick={()=>{setScreen('list');setSelected(null);setFilters({...initialFilters,ownedOnly:true})}}>✓<span>所持カード</span></button><button className={screen==='settings'?'active':''} onClick={()=>{setScreen('settings');setSelected(null)}}>⚙<span>設定</span></button></nav></div>;
}
