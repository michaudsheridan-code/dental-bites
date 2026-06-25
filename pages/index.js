import { useState, useEffect, useRef } from "react";

const questions = [
  { topic: "Pharmacology", q: "A patient on warfarin needs an antibiotic for a tooth extraction. Which is the safest choice with the least effect on INR?", opts: ["Metronidazole","Amoxicillin","Erythromycin","Ciprofloxacin"], ans: 1, exp: "Amoxicillin has minimal interaction with warfarin and is the first-line antibiotic in most dental prophylaxis scenarios. Metronidazole and macrolides can significantly potentiate warfarin's anticoagulant effect by inhibiting CYP2C9." },
  { topic: "Oral Pathology", q: "A 55-year-old male presents with a painless, slow-growing white patch on the lateral border of the tongue that cannot be wiped off. Biopsy is most likely to reveal:", opts: ["Candidiasis","Leukoplakia","Lichen planus","Fibroma"], ans: 1, exp: "Leukoplakia is a clinical term for a white patch that cannot be wiped off and has no other definable cause. The lateral tongue is a high-risk site — biopsy is essential to rule out dysplasia or carcinoma." },
  { topic: "Endodontics", q: "During access preparation on a mandibular first molar, which canal is most commonly missed?", opts: ["Mesiobuccal","Distolingual","Middle mesial","Distal"], ans: 2, exp: "The middle mesial canal is a well-documented but often missed canal in mandibular first molars. CBCT studies report its prevalence at 20–40%." },
  { topic: "Periodontics", q: "According to the 2017 World Workshop classification, generalized Stage III Grade C periodontitis is most strongly associated with which risk factor?", opts: ["Smoking > 10 cigarettes/day","Poorly controlled diabetes (HbA1c ≥ 7%)","Osteoporosis","Stress"], ans: 1, exp: "Poorly controlled diabetes (HbA1c ≥ 7%) is a primary risk modifier for Grade C periodontitis, indicating rapid progression and significant systemic modulation." },
  { topic: "Radiology", q: "Which radiographic finding is most characteristic of a dentigerous cyst?", opts: ["Periapical radiolucency at root apex","Pericoronal radiolucency attached at the CEJ","Multilocular radiolucency crossing midline","Calcifications within a follicular space"], ans: 1, exp: "A pericoronal radiolucency attached at the CEJ of an unerupted tooth is pathognomonic for a dentigerous cyst — the most common developmental odontogenic cyst." }
];

const COLORS = [
  { base: '#F4A8B8', dark: '#C06878', light: '#FFD8E4' },
  { base: '#F8D080', dark: '#C09030', light: '#FFF0B0' },
  { base: '#A8D8B8', dark: '#5C9870', light: '#D4F0DC' },
  { base: '#A8C8F4', dark: '#5880C8', light: '#D4E8FF' },
  { base: '#F8C090', dark: '#C07840', light: '#FFE0C0' },
  { base: '#C8B0E8', dark: '#8868B8', light: '#E8D8FF' },
];

const WORDS = ['clack!','chomp!','click!','snap!'];

function LoadingScreen({ onDone }) {
  const stageRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const intervals = [];

    function spawnBubble(x, y, text) {
      const b = document.createElement('div');
      b.textContent = text;
      Object.assign(b.style, {
        position:'absolute', fontSize:'9px', fontWeight:'600',
        color:'#C97820', opacity:'1', pointerEvents:'none',
        whiteSpace:'nowrap', left:x+'px', top:y+'px',
        fontFamily:'system-ui,sans-serif', transition:'none'
      });
      stage.appendChild(b);
      let op=1, ty=0;
      const iv = setInterval(()=>{
        ty-=0.8; op-=0.036;
        b.style.transform='translateY('+ty+'px)';
        b.style.opacity=op;
        if(op<=0){clearInterval(iv);b.remove();}
      },28);
    }

    function makeToy(id) {
      const c = COLORS[id % COLORS.length];
      const PIVOT_X=6, PIVOT_Y=40;
      const BASE_X=10, BASE_W=52, BASE_RX=9, BASE_H=15;
      const U_BASE_Y=17, U_GUM_BOT=32;
      const L_BASE_Y=48, L_GUM_TOP=48;

      const teeth = [
        {x:BASE_X+2, w:12,uh:9, lh:8, type:'molar'},
        {x:BASE_X+14,w:11,uh:10,lh:9, type:'molar'},
        {x:BASE_X+25,w:8, uh:11,lh:10,type:'premolar'},
        {x:BASE_X+33,w:7, uh:12,lh:11,type:'canine'},
        {x:BASE_X+40,w:6, uh:11,lh:10,type:'lateral'},
        {x:BASE_X+46,w:6, uh:12,lh:11,type:'central'},
      ];

      function uTooth(t){
        const{x,w,uh:h,type}=t;
        const y0=U_GUM_BOT,yb=y0+h,ch=Math.round(h*.32);
        if(type==='molar')return`<path d="M${x},${y0} L${x},${yb-ch} Q${x},${yb} ${x+w*.2},${yb} Q${x+w*.38},${yb-ch*.55} ${x+w*.5},${yb} Q${x+w*.62},${yb-ch*.55} ${x+w*.8},${yb} Q${x+w},${yb} ${x+w},${yb-ch} L${x+w},${y0} Z" fill="url(#tU${id})" stroke="#C8C0B0" stroke-width="0.7"/><line x1="${x+w*.33}" y1="${y0+1}" x2="${x+w*.33}" y2="${yb-ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/><line x1="${x+w*.66}" y1="${y0+1}" x2="${x+w*.66}" y2="${yb-ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/>`;
        if(type==='premolar')return`<path d="M${x},${y0} L${x},${yb-ch} Q${x},${yb} ${x+w*.28},${yb} Q${x+w*.5},${yb-ch*.6} ${x+w*.72},${yb} Q${x+w},${yb} ${x+w},${yb-ch} L${x+w},${y0} Z" fill="url(#tU${id})" stroke="#C8C0B0" stroke-width="0.7"/><line x1="${x+w*.5}" y1="${y0+1}" x2="${x+w*.5}" y2="${yb-ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/>`;
        if(type==='canine')return`<path d="M${x},${y0} L${x},${yb-ch*.5} Q${x},${yb} ${x+w*.28},${yb} L${x+w*.5},${yb+2} L${x+w*.72},${yb} Q${x+w},${yb} ${x+w},${yb-ch*.5} L${x+w},${y0} Z" fill="url(#tU${id})" stroke="#C8C0B0" stroke-width="0.7"/>`;
        return`<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="2.5" fill="url(#tU${id})" stroke="#C8C0B0" stroke-width="0.7"/>`;
      }

      function lTooth(t){
        const{x,w,lh:h,type}=t;
        const y0=L_GUM_TOP,yt=y0-h,ch=Math.round(h*.32);
        if(type==='molar')return`<path d="M${x},${y0} L${x},${yt+ch} Q${x},${yt} ${x+w*.2},${yt} Q${x+w*.38},${yt+ch*.55} ${x+w*.5},${yt} Q${x+w*.62},${yt+ch*.55} ${x+w*.8},${yt} Q${x+w},${yt} ${x+w},${yt+ch} L${x+w},${y0} Z" fill="url(#tL${id})" stroke="#C8C0B0" stroke-width="0.7"/><line x1="${x+w*.33}" y1="${y0-1}" x2="${x+w*.33}" y2="${yt+ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/><line x1="${x+w*.66}" y1="${y0-1}" x2="${x+w*.66}" y2="${yt+ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/>`;
        if(type==='premolar')return`<path d="M${x},${y0} L${x},${yt+ch} Q${x},${yt} ${x+w*.28},${yt} Q${x+w*.5},${yt+ch*.6} ${x+w*.72},${yt} Q${x+w},${yt} ${x+w},${yt+ch} L${x+w},${y0} Z" fill="url(#tL${id})" stroke="#C8C0B0" stroke-width="0.7"/><line x1="${x+w*.5}" y1="${y0-1}" x2="${x+w*.5}" y2="${yt+ch*.9}" stroke="#DDD8C8" stroke-width="0.5"/>`;
        if(type==='canine')return`<path d="M${x},${y0} L${x},${yt+ch*.5} Q${x},${yt} ${x+w*.28},${yt} L${x+w*.5},${yt-2} L${x+w*.72},${yt} Q${x+w},${yt} ${x+w},${yt+ch*.5} L${x+w},${y0} Z" fill="url(#tL${id})" stroke="#C8C0B0" stroke-width="0.7"/>`;
        return`<rect x="${x}" y="${yt}" width="${w}" height="${h}" rx="2.5" fill="url(#tL${id})" stroke="#C8C0B0" stroke-width="0.7"/>`;
      }

      const uT=teeth.map(t=>uTooth(t)).join('');
      const lT=teeth.map(t=>lTooth(t)).join('');

      const cont=document.createElement('div');
      cont.style.cssText='position:absolute;width:80px;height:90px;overflow:visible;';
      const stageH=stage.offsetHeight||300;
      const baseY=Math.round((stageH-75)/2);
      cont.style.top=baseY+'px';
      cont.style.left='-90px';

      const ns='http://www.w3.org/2000/svg';
      function makeSVG(innerHTML){
        const s=document.createElementNS(ns,'svg');
        s.setAttribute('width','80');s.setAttribute('height','90');
        s.setAttribute('viewBox','0 0 80 90');
        s.style.cssText='position:absolute;top:0;left:0;overflow:visible;';
        s.innerHTML=innerHTML;
        return s;
      }

      const defs=`<defs>
        <linearGradient id="ugU${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c.light}"/><stop offset="100%" stop-color="${c.base}"/></linearGradient>
        <linearGradient id="ugL${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c.base}"/><stop offset="100%" stop-color="${c.light}"/></linearGradient>
        <linearGradient id="tU${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFEFC"/><stop offset="100%" stop-color="#E8E0CC"/></linearGradient>
        <linearGradient id="tL${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#FFFEFC"/><stop offset="100%" stop-color="#E8E0CC"/></linearGradient>
        <linearGradient id="ecU${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c.dark}"/><stop offset="100%" stop-color="${c.light}"/></linearGradient>
        <linearGradient id="ecL${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c.dark}"/><stop offset="100%" stop-color="${c.light}"/></linearGradient>
      </defs>`;

      const svgL=makeSVG(`${defs}
        <g id="L${id}" style="transform-origin:${PIVOT_X}px ${PIVOT_Y}px;">
          <rect x="${PIVOT_X}" y="${L_BASE_Y+4}" width="${BASE_X-PIVOT_X+3}" height="${BASE_H-8}" rx="2.5" fill="${c.base}" stroke="${c.dark}" stroke-width="0.7"/>
          <rect x="${BASE_X}" y="${L_BASE_Y}" width="${BASE_W}" height="${BASE_H}" rx="${BASE_RX}" fill="url(#ugL${id})" stroke="${c.dark}" stroke-width="0.8"/>
          <ellipse cx="${BASE_X}" cy="${L_BASE_Y+BASE_H/2}" rx="5" ry="${BASE_H/2}" fill="url(#ecL${id})" stroke="${c.dark}" stroke-width="0.8"/>
          <ellipse cx="${BASE_X+BASE_W}" cy="${L_BASE_Y+BASE_H/2}" rx="5" ry="${BASE_H/2}" fill="url(#ecL${id})" stroke="${c.dark}" stroke-width="0.8"/>
          ${lT}
        </g>`);

      const svgU=makeSVG(`${defs}
        <g id="U${id}" style="transform-origin:${PIVOT_X}px ${PIVOT_Y}px;">
          <rect x="${PIVOT_X}" y="${U_BASE_Y+4}" width="${BASE_X-PIVOT_X+3}" height="${BASE_H-8}" rx="2.5" fill="${c.base}" stroke="${c.dark}" stroke-width="0.7"/>
          <rect x="${BASE_X}" y="${U_BASE_Y}" width="${BASE_W}" height="${BASE_H}" rx="${BASE_RX}" fill="url(#ugU${id})" stroke="${c.dark}" stroke-width="0.8"/>
          <ellipse cx="${BASE_X}" cy="${U_BASE_Y+BASE_H/2}" rx="5" ry="${BASE_H/2}" fill="url(#ecU${id})" stroke="${c.dark}" stroke-width="0.8"/>
          <ellipse cx="${BASE_X+BASE_W}" cy="${U_BASE_Y+BASE_H/2}" rx="5" ry="${BASE_H/2}" fill="url(#ecU${id})" stroke="${c.dark}" stroke-width="0.8"/>
          ${uT}
        </g>`);

      const svgH=makeSVG(`
        <circle cx="${PIVOT_X}" cy="${PIVOT_Y}" r="6.5" fill="${c.dark}" stroke="${c.dark}" stroke-width="0.5"/>
        <circle cx="${PIVOT_X}" cy="${PIVOT_Y}" r="4.2" fill="${c.base}" stroke="${c.dark}" stroke-width="0.4"/>
        <circle cx="${PIVOT_X}" cy="${PIVOT_Y}" r="1.8" fill="${c.light}" stroke="${c.dark}" stroke-width="0.3"/>`);

      cont.appendChild(svgL);
      cont.appendChild(svgU);
      cont.appendChild(svgH);
      stage.appendChild(cont);

      const upper=svgU.querySelector('#U'+id);
      const lower=svgL.querySelector('#L'+id);
      let x=-90;
      const stageW=stage.offsetWidth||680;
      const speed=0.65+Math.random()*0.6;
      let frame=0,mouthOpen=false,wordIdx=0;

      const iv=setInterval(()=>{
        frame++;x+=speed;
        cont.style.left=x+'px';
        const s=Math.sin(frame*0.10);
        const t=(s+1)/2;
        const openAmt=t*18;
        upper.style.transform='rotate('+(-openAmt*0.42)+'deg)';
        lower.style.transform='rotate('+(openAmt*0.58)+'deg)';
        cont.style.top=(baseY-t*1.5)+'px';
        if(t>0.88&&!mouthOpen){
          mouthOpen=true;
          spawnBubble(x+42,baseY-14,WORDS[wordIdx++%WORDS.length]);
        } else if(t<0.12){mouthOpen=false;}
        if(x>stageW+10){clearInterval(iv);cont.remove();}
      },16);
      intervals.push(iv);
    }

    makeToy(countRef.current++);
    const spawnIv = setInterval(()=>makeToy(countRef.current++), 2200);
    intervals.push(spawnIv);

    // Auto-dismiss after 3 seconds
    const dismissTimer = setTimeout(()=>onDone(), 3000);

    return ()=>{
      intervals.forEach(clearInterval);
      clearTimeout(dismissTimer);
    };
  }, [onDone]);

  return (
    <div style={{
      position:'fixed', inset:0, background:'#fff',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', zIndex:100
    }}>
      <div style={{fontSize:28,fontWeight:500,marginBottom:8}}>Dental Bites</div>
      <div style={{fontSize:14,color:'#888',marginBottom:32}}>Loading today's quiz...</div>
      <div ref={stageRef} style={{
        width:'100%', maxWidth:620, height:180, position:'relative',
        overflow:'hidden', background:'#faf9f7', borderRadius:16
      }}/>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("start");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [dateStr, setDateStr] = useState("");
  const handleDone = () => setLoading(false);

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}));
  }, []);

  function startQuiz(){setCurrent(0);setScore(0);setSelected(null);setStartTime(Date.now());setScreen("quiz");}
  function selectAnswer(i){
    if(selected!==null)return;
    setSelected(i);
    if(i===questions[current].ans)setScore(s=>s+1);
  }
  function next(){
    if(current+1>=questions.length){setElapsed(Math.round((Date.now()-startTime)/1000));setScreen("score");}
    else{setCurrent(c=>c+1);setSelected(null);}
  }

  const q=questions[current];
  const letters=["A","B","C","D"];

  if(loading) return <LoadingScreen onDone={handleDone}/>;

  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:620,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <style>{`
        @keyframes clackUp{from{transform:translateY(0)}to{transform:translateY(-4px)}}
        @keyframes clackDown{from{transform:translateY(0)}to{transform:translateY(4px)}}
      `}</style>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #eee",paddingBottom:"1rem",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{animation:"clackUp 0.45s ease-in-out infinite alternate"}}>
              <div style={{display:"flex",background:"#F4A8A8",borderRadius:"5px 5px 0 0",padding:"4px 4px 0",gap:2}}>
                {[13,16,18,16,13].map((h,i)=><div key={i} style={{width:11,height:h,background:"#FAFFF8",border:"1px solid #D8D0C8",borderRadius:"2px 2px 4px 4px"}}/>)}
              </div>
            </div>
            <div style={{height:4}}/>
            <div style={{animation:"clackDown 0.45s ease-in-out infinite alternate"}}>
              <div style={{display:"flex",background:"#F4A8A8",borderRadius:"0 0 5px 5px",padding:"0 4px 4px",gap:2}}>
                {[11,13,15,13,11].map((h,i)=><div key={i} style={{width:11,height:h,background:"#FAFFF8",border:"1px solid #D8D0C8",borderRadius:"4px 4px 2px 2px"}}/>)}
              </div>
            </div>
          </div>
          <div>
            <div style={{fontSize:22,fontWeight:500}}>Dental Bites</div>
            <div style={{fontSize:12,color:"#888",letterSpacing:"0.08em",textTransform:"uppercase"}}>Daily Quiz</div>
          </div>
        </div>
        <div style={{fontSize:13,color:"#888"}}>Streak <span style={{fontSize:16,fontWeight:500,color:"#E08B2B"}}>🔥 7</span></div>
      </div>

      <div style={{textAlign:"center",fontSize:13,color:"#888",marginBottom:"1.5rem"}}>{dateStr}</div>

      {screen==="start"&&(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:500,marginBottom:6}}>Today's Bite</div>
          <div style={{fontSize:15,color:"#666",marginBottom:"1.5rem"}}>5 questions. Sharpen your clinical edge.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:"1.5rem"}}>
            {[["🕐","~3 minutes"],["🦷","Board-style"],["🏆","Daily rank"]].map(([icon,label],i)=>(
              <div key={i} style={{background:"#faf9f7",borderRadius:10,padding:"0.75rem",fontSize:13,color:"#666"}}>
                <div style={{fontSize:20,marginBottom:6}}>{icon}</div>{label}
              </div>
            ))}
          </div>
          <button onClick={startQuiz} style={{width:"100%",padding:15,borderRadius:12,background:"#E08B2B",color:"#fff",border:"none",fontSize:17,fontWeight:500,cursor:"pointer"}}>
            Start today's quiz
          </button>
        </div>
      )}

      {screen==="quiz"&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:"1.5rem"}}>
            {questions.map((_,i)=>(<div key={i} style={{flex:1,height:4,borderRadius:2,background:i<current?"#E08B2B":i===current?"#F0B95A":"#eee"}}/>))}
          </div>
          <div style={{border:"1px dashed #ddd",borderRadius:8,padding:"10px 16px",textAlign:"center",fontSize:11,color:"#aaa",marginBottom:"1.25rem"}}>Advertisement</div>
          <div style={{fontSize:12,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Question {current+1} of 5 · {q.topic}</div>
          <div style={{fontSize:17,fontWeight:500,lineHeight:1.5,marginBottom:"1.5rem"}}>{q.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:"1.5rem"}}>
            {q.opts.map((o,i)=>{
              let bg="#fff",border="1px solid #ddd",lBg="transparent",lCol="#888";
              if(selected!==null){
                if(i===q.ans){bg="#EAF3DE";border="1px solid #3B6D11";lBg="#3B6D11";lCol="#fff";}
                else if(i===selected){bg="#FCEBEB";border="1px solid #A32D2D";lBg="#A32D2D";lCol="#fff";}
              }
              return(
                <button key={i} onClick={()=>selectAnswer(i)} disabled={selected!==null}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",border,borderRadius:12,background:bg,cursor:selected!==null?"default":"pointer",fontSize:15,textAlign:"left"}}>
                  <span style={{width:28,height:28,borderRadius:"50%",border:selected!==null&&(i===q.ans||i===selected)?"none":"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,flexShrink:0,background:lBg,color:lCol}}>{letters[i]}</span>
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
          {selected!==null&&(
            <>
              <div style={{background:"#faf9f7",borderRadius:10,padding:"1rem",fontSize:14,lineHeight:1.6,color:"#555",borderLeft:"3px solid #E08B2B",marginBottom:"1.25rem"}}>
                <strong style={{color:"#222"}}>{q.opts[q.ans]}</strong> — {q.exp}
              </div>
              <button onClick={next} style={{width:"100%",padding:14,borderRadius:12,background:"#E08B2B",color:"#fff",border:"none",fontSize:16,fontWeight:500,cursor:"pointer"}}>
                {current<4?"Next question":"See my results"}
              </button>
            </>
          )}
        </div>
      )}

      {screen==="score"&&(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:14,color:"#888",marginBottom:6}}>Quiz complete!</div>
          <div style={{fontSize:52,fontWeight:500,color:"#E08B2B",lineHeight:1}}>{score}</div>
          <div style={{fontSize:14,color:"#888",marginBottom:"1.5rem"}}>out of 5 correct</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:"1.5rem"}}>
            {[[elapsed,"seconds"],["7","day streak"],["#"+(score>=5?"3":score>=4?"4":"5"),"today's rank"]].map(([val,lbl],i)=>(
              <div key={i} style={{background:"#faf9f7",borderRadius:10,padding:"0.75rem"}}>
                <div style={{fontSize:22,fontWeight:500}}>{val}</div>
                <div style={{fontSize:12,color:"#aaa"}}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{border:"1px solid #eee",borderRadius:12,overflow:"hidden",marginBottom:"1.5rem"}}>
            <div style={{background:"#faf9f7",padding:"10px 16px",fontSize:12,fontWeight:500,color:"#888",textTransform:"uppercase",letterSpacing:"0.07em",display:"flex",justifyContent:"space-between"}}>
              <span>Today's leaderboard</span><span>Score</span>
            </div>
            {[["Dr. Patel","18d","5/5",true],["DrSmithDDS","42d","5/5",true],["You","7d",score+"/5",false,true],["ToothFairy_RDH","5d","4/5",false],["OralSurgeonMD","3d","3/5",false]].map(([name,streak,sc,gold,you],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",padding:"11px 16px",borderTop:"1px solid #eee",fontSize:14,gap:10}}>
                <span style={{width:20,fontWeight:500,color:gold?"#E08B2B":"#888"}}>{i+1}</span>
                <span style={{flex:1,color:you?"#E08B2B":"#222",fontWeight:you?500:400}}>{name}</span>
                <span style={{fontSize:12,color:"#aaa"}}>{streak}</span>
                <span style={{fontWeight:500}}>{sc}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:"1rem"}}>
            <button onClick={startQuiz} style={{flex:1,padding:12,borderRadius:12,border:"1px solid #ddd",background:"#fff",fontSize:14,cursor:"pointer"}}>Play again</button>
            <button onClick={()=>alert('Result copied! 🦷')} style={{flex:1,padding:12,borderRadius:12,border:"1px solid #ddd",background:"#fff",fontSize:14,cursor:"pointer"}}>Share result</button>
          </div>
          <div style={{border:"1px dashed #ddd",borderRadius:8,padding:"10px 16px",textAlign:"center",fontSize:11,color:"#aaa"}}>Advertisement</div>
        </div>
      )}
    </div>
  );
}
