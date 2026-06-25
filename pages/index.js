import { useState, useEffect } from "react";

const questions = [
  { topic: "Pharmacology", q: "A patient on warfarin needs an antibiotic for a tooth extraction. Which is the safest choice with the least effect on INR?", opts: ["Metronidazole","Amoxicillin","Erythromycin","Ciprofloxacin"], ans: 1, exp: "Amoxicillin has minimal interaction with warfarin and is the first-line antibiotic in most dental prophylaxis scenarios. Metronidazole and macrolides can significantly potentiate warfarin's anticoagulant effect by inhibiting CYP2C9." },
  { topic: "Oral Pathology", q: "A 55-year-old male presents with a painless, slow-growing white patch on the lateral border of the tongue that cannot be wiped off. Biopsy is most likely to reveal:", opts: ["Candidiasis","Leukoplakia","Lichen planus","Fibroma"], ans: 1, exp: "Leukoplakia is a clinical term for a white patch that cannot be wiped off and has no other definable cause. The lateral tongue is a high-risk site — biopsy is essential to rule out dysplasia or carcinoma." },
  { topic: "Endodontics", q: "During access preparation on a mandibular first molar, which canal is most commonly missed?", opts: ["Mesiobuccal","Distolingual","Middle mesial","Distal"], ans: 2, exp: "The middle mesial canal is a well-documented but often missed canal in mandibular first molars. CBCT studies report its prevalence at 20–40%." },
  { topic: "Periodontics", q: "According to the 2017 World Workshop classification, generalized Stage III Grade C periodontitis is most strongly associated with which risk factor?", opts: ["Smoking > 10 cigarettes/day","Poorly controlled diabetes (HbA1c ≥ 7%)","Osteoporosis","Stress"], ans: 1, exp: "Poorly controlled diabetes (HbA1c ≥ 7%) is a primary risk modifier for Grade C periodontitis, indicating rapid progression and significant systemic modulation." },
  { topic: "Radiology", q: "Which radiographic finding is most characteristic of a dentigerous cyst?", opts: ["Periapical radiolucency at root apex","Pericoronal radiolucency attached at the CEJ","Multilocular radiolucency crossing midline","Calcifications within a follicular space"], ans: 1, exp: "A pericoronal radiolucency attached at the CEJ of an unerupted tooth is pathognomonic for a dentigerous cyst — the most common developmental odontogenic cyst." }
];

export default function Home() {
  const [screen, setScreen] = useState("start");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" }));
  }, []);

  function startQuiz() {
    setCurrent(0); setScore(0); setSelected(null);
    setStartTime(Date.now()); setScreen("quiz");
  }

  function selectAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[current].ans) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
      setScreen("score");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  const q = questions[current];
  const letters = ["A","B","C","D"];

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:620, margin:"0 auto", padding:"1.5rem 1rem" }}>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #eee", paddingBottom:"1rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ animation:"clackUp 0.45s ease-in-out infinite alternate" }}>
              <div style={{ display:"flex", background:"#F4A8A8", borderRadius:"5px 5px 0 0", padding:"4px 4px 0", gap:2 }}>
                {[13,16,18,16,13].map((h,i) => <div key={i} style={{ width:11, height:h, background:"#FAFFF8", border:"1px solid #D8D0C8", borderRadius:"2px 2px 4px 4px" }}/>)}
              </div>
            </div>
            <div style={{ height:4 }}/>
            <div style={{ animation:"clackDown 0.45s ease-in-out infinite alternate" }}>
              <div style={{ display:"flex", background:"#F4A8A8", borderRadius:"0 0 5px 5px", padding:"0 4px 4px", gap:2 }}>
                {[11,13,15,13,11].map((h,i) => <div key={i} style={{ width:11, height:h, background:"#FAFFF8", border:"1px solid #D8D0C8", borderRadius:"4px 4px 2px 2px" }}/>)}
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:500 }}>Dental Bites</div>
            <div style={{ fontSize:12, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase" }}>Daily Quiz</div>
          </div>
        </div>
        <div style={{ fontSize:13, color:"#888" }}>Streak <span style={{ fontSize:16, fontWeight:500, color:"#E08B2B" }}>🔥 7</span></div>
      </div>

      <style>{`
        @keyframes clackUp { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        @keyframes clackDown { from { transform: translateY(0); } to { transform: translateY(4px); } }
      `}</style>

      <div style={{ textAlign:"center", fontSize:13, color:"#888", marginBottom:"1.5rem" }}>{dateStr}</div>

      {/* START SCREEN */}
      {screen === "start" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:28, fontWeight:500, marginBottom:6 }}>Today's Bite</div>
          <div style={{ fontSize:15, color:"#666", marginBottom:"1.5rem" }}>5 questions. Sharpen your clinical edge.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:"1.5rem" }}>
            {[["🕐","~3 minutes"],["🦷","Board-style"],["🏆","Daily rank"]].map(([icon,label],i) => (
              <div key={i} style={{ background:"#faf9f7", borderRadius:10, padding:"0.75rem", fontSize:13, color:"#666" }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>{label}
              </div>
            ))}
          </div>
          <button onClick={startQuiz} style={{ width:"100%", padding:15, borderRadius:12, background:"#E08B2B", color:"#fff", border:"none", fontSize:17, fontWeight:500, cursor:"pointer" }}>
            Start today's quiz
          </button>
        </div>
      )}

      {/* QUIZ SCREEN */}
      {screen === "quiz" && (
        <div>
          <div style={{ display:"flex", gap:6, marginBottom:"1.5rem" }}>
            {questions.map((_,i) => (
              <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i < current ? "#E08B2B" : i === current ? "#F0B95A" : "#eee" }}/>
            ))}
          </div>
          <div style={{ border:"1px dashed #ddd", borderRadius:8, padding:"10px 16px", textAlign:"center", fontSize:11, color:"#aaa", marginBottom:"1.25rem" }}>Advertisement</div>
          <div style={{ fontSize:12, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Question {current+1} of 5 · {q.topic}</div>
          <div style={{ fontSize:17, fontWeight:500, lineHeight:1.5, marginBottom:"1.5rem" }}>{q.q}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1.5rem" }}>
            {q.opts.map((o,i) => {
              let bg = "#fff", border = "1px solid #ddd", letterBg = "transparent", letterColor = "#888";
              if (selected !== null) {
                if (i === q.ans) { bg = "#EAF3DE"; border = "1px solid #3B6D11"; letterBg = "#3B6D11"; letterColor = "#fff"; }
                else if (i === selected) { bg = "#FCEBEB"; border = "1px solid #A32D2D"; letterBg = "#A32D2D"; letterColor = "#fff"; }
              }
              return (
                <button key={i} onClick={() => selectAnswer(i)} disabled={selected !== null}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", border, borderRadius:12, background:bg, cursor: selected !== null ? "default" : "pointer", fontSize:15, textAlign:"left" }}>
                  <span style={{ width:28, height:28, borderRadius:"50%", border: selected !== null && (i===q.ans||i===selected) ? "none" : "1.5px solid #ddd", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:500, flexShrink:0, background:letterBg, color:letterColor }}>{letters[i]}</span>
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <>
              <div style={{ background:"#faf9f7", borderRadius:10, padding:"1rem", fontSize:14, lineHeight:1.6, color:"#555", borderLeft:"3px solid #E08B2B", marginBottom:"1.25rem" }}>
                <strong style={{ color:"#222" }}>{q.opts[q.ans]}</strong> — {q.exp}
              </div>
              <button onClick={next} style={{ width:"100%", padding:14, borderRadius:12, background:"#E08B2B", color:"#fff", border:"none", fontSize:16, fontWeight:500, cursor:"pointer" }}>
                {current < 4 ? "Next question" : "See my results"}
              </button>
            </>
          )}
        </div>
      )}

      {/* SCORE SCREEN */}
      {screen === "score" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:14, color:"#888", marginBottom:6 }}>Quiz complete!</div>
          <div style={{ fontSize:52, fontWeight:500, color:"#E08B2B", lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:14, color:"#888", marginBottom:"1.5rem" }}>out of 5 correct</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:"1.5rem" }}>
            {[[elapsed,"seconds"],["7","day streak"],["#"+(score>=5?"3":score>=4?"4":"5"),"today's rank"]].map(([val,lbl],i)=>(
              <div key={i} style={{ background:"#faf9f7", borderRadius:10, padding:"0.75rem" }}>
                <div style={{ fontSize:22, fontWeight:500 }}>{val}</div>
                <div style={{ fontSize:12, color:"#aaa" }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ border:"1px solid #eee", borderRadius:12, overflow:"hidden", marginBottom:"1.5rem" }}>
            <div style={{ background:"#faf9f7", padding:"10px 16px", fontSize:12, fontWeight:500, color:"#888", textTransform:"uppercase", letterSpacing:"0.07em", display:"flex", justifyContent:"space-between" }}>
              <span>Today's leaderboard</span><span>Score</span>
            </div>
            {[["Dr. Patel","18d","5/5",true],["DrSmithDDS","42d","5/5",true],["You","7d",score+"/5",false,true],["ToothFairy_RDH","5d","4/5",false],["OralSurgeonMD","3d","3/5",false]].map(([name,streak,sc,gold,you],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", padding:"11px 16px", borderTop:"1px solid #eee", fontSize:14, gap:10 }}>
                <span style={{ width:20, fontWeight:500, color: gold?"#E08B2B":"#888" }}>{i+1}</span>
                <span style={{ flex:1, color: you?"#E08B2B":"#222", fontWeight: you?500:400 }}>{name}</span>
                <span style={{ fontSize:12, color:"#aaa" }}>{streak}</span>
                <span style={{ fontWeight:500 }}>{sc}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:"1rem" }}>
            <button onClick={startQuiz} style={{ flex:1, padding:12, borderRadius:12, border:"1px solid #ddd", background:"#fff", fontSize:14, cursor:"pointer" }}>Play again</button>
            <button onClick={()=>alert("Result copied! 🦷")} style={{ flex:1, padding:12, borderRadius:12, border:"1px solid #ddd", background:"#fff", fontSize:14, cursor:"pointer" }}>Share result</button>
          </div>
          <div style={{ border:"1px dashed #ddd", borderRadius:8, padding:"10px 16px", textAlign:"center", fontSize:11, color:"#aaa" }}>Advertisement</div>
        </div>
      )}
    </div>
  );
}
