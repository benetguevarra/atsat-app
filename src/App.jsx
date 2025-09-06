
import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "atsat-v1";

const SECTIONS = [
  {
    id: "autocad",
    title: "AutoCAD Fundamentals",
    questions: [
      {
        id: "cad-1",
        text: "What is the best practice for using Model Space and Paper Space?",
        choices: [
          "Draft and annotate everything in Model Space only",
          "Draft in Model Space; scale/annotate/plot through viewports in Paper Space",
          "Draft in Paper Space; print from Model Space",
          "Use either; they are identical"
        ],
        answer: 1
      },
      {
        id: "cad-2",
        text: "XREF vs BLOCK — which statement is accurate?",
        choices: [
          "BLOCK references an external DWG; XREF is embedded",
          "XREF references an external DWG; BLOCK is embedded in the current file",
          "Both are external",
          "Both are embedded"
        ],
        answer: 1
      },
      {
        id: "cad-3",
        text: "How do you keep text and dimensions at consistent plotted size across multiple viewports?",
        choices: [
          "Set fixed text size in Model Space and ignore viewport scale",
          "Use Annotative objects with annotation scales and/or viewport‑based dimensions",
          "Explode dimensions before plotting",
          "Freeze layers per viewport only"
        ],
        answer: 1
      },
      {
        id: "cad-4",
        text: "CTB vs STB plot styles — which is correct?",
        choices: [
          "CTB maps colors to lineweights; STB maps named styles to lineweights",
          "Both map layers to viewports",
          "STB is only for 3D",
          "There is no difference"
        ],
        answer: 0
      },
      {
        id: "cad-5",
        text: "Title blocks that auto‑fill sheet data (Project No., Sheet Name, Revision, etc.) should use:",
        choices: [
          "Exploded polylines",
          "Mtext only",
          "Block attributes/fields tied to sheet set properties",
          "Hatches"
        ],
        answer: 2
      },
      {
        id: "cad-6",
        text: "Best practice for layer management across a team:",
        choices: [
          "Let each user create any naming",
          "Adopt a shared naming standard (e.g., discipline‑major‑minor) and use Layer States",
          "Put everything on Layer 0",
          "Freeze all annotation layers"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "revit",
    title: "Revit/BIM Essentials",
    questions: [
      {
        id: "rv-1",
        text: "System vs Loadable families — which is true?",
        choices: [
          "Both are created in external RFA files",
          "System families (walls/roofs) exist only in the project; loadable families are RFA components",
          "Loadable families exist only in the project",
          "No difference"
        ],
        answer: 1
      },
      {
        id: "rv-2",
        text: "Proper team workflow with Worksharing is to:",
        choices: [
          "All users edit the Central Model directly",
          "Each user creates a Local file from the Central and syncs with central regularly",
          "Email RVT back and forth",
          "Duplicate the central for each user"
        ],
        answer: 1
      },
      {
        id: "rv-3",
        text: "View Templates are used to:",
        choices: [
          "Apply consistent graphics and view settings across multiple views",
          "Place sheets",
          "Create schedules",
          "Define phases"
        ],
        answer: 0
      },
      {
        id: "rv-4",
        text: "Design Options vs Phasing — correct pairing is:",
        choices: [
          "Design Options = time; Phasing = alternative designs",
          "Design Options = alternative designs; Phasing = time‑based stages",
          "Both handle time",
          "Both handle alternatives"
        ],
        answer: 1
      },
      {
        id: "rv-5",
        text: "Shared Parameters are primarily used for:",
        choices: [
          "Linking CAD files",
          "Consistent data fields across families/projects for tagging and schedules",
          "Rendering settings",
          "Room separation"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "bluebeam",
    title: "Bluebeam Revu (Review & Takeoff)",
    questions: [
      {
        id: "bb-1",
        text: "The Tool Chest in Bluebeam is for:",
        choices: [
          "Managing sheet sets",
          "Saving and reusing custom markups and takeoff tools",
          "Exporting DWGs",
          "Printing to DWF"
        ],
        answer: 1
      },
      {
        id: "bb-2",
        text: "Overlay Pages / Compare Documents helps you:",
        choices: [
          "Bind PDFs",
          "Visually detect changes between drawing revisions",
          "Create 3D PDFs",
          "Split sheets"
        ],
        answer: 1
      },
      {
        id: "bb-3",
        text: "Accurate measurements in Revu require first:",
        choices: [
          "Flattening markups",
          "Calibrating the scale using a known dimension",
          "Converting to grayscale",
          "Cropping the page"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "docs",
    title: "Construction Documents & Process",
    questions: [
      {
        id: "cd-1",
        text: "On a plan, a callout like 3/A401 typically means:",
        choices: [
          "Detail 3 on sheet A401",
          "Sheet 3 on detail A401",
          "Room 3 on level A401",
          "Phase 3 in set A401"
        ],
        answer: 0
      },
      {
        id: "cd-2",
        text: "RFI vs ASI — the correct description is:",
        choices: [
          "RFI is an owner change; ASI is a contractor question",
          "RFI is a formal question seeking clarification; ASI issues architect instructions without a full change order",
          "They are identical",
          "Both are shop drawings"
        ],
        answer: 1
      },
      {
        id: "cd-3",
        text: "Who has jurisdiction over building code compliance on a project?",
        choices: [
          "The AHJ (Authority Having Jurisdiction), typically the local building department",
          "Only the owner",
          "Only the GC",
          "Only the architect"
        ],
        answer: 0
      },
      {
        id: "cd-4",
        text: "Revision clouds and delta tags should be:",
        choices: [
          "Drawn artistically anywhere",
          "Placed around changed areas with a matching revision index on the sheet",
          "Used only on title sheets",
          "Omitted once issued"
        ],
        answer: 1
      },
      {
        id: "cd-5",
        text: "Shop Drawings are primarily used to:",
        choices: [
          "Replace contract documents",
          "Show the fabricator/installer's detailed means, methods, and product data for review",
          "Approve payment",
          "Issue RFIs"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "coord",
    title: "Coordination & QA/QC",
    questions: [
      {
        id: "qa-1",
        text: "Common software used for federation and clash detection across trades:",
        choices: ["Illustrator", "Navisworks", "Premiere Pro", "Twinmotion"],
        answer: 1
      },
      {
        id: "qa-2",
        text: "Before issuing a set, which should be verified?",
        choices: [
          "Title block data",
          "Sheet list and numbering",
          "View scales and north arrows",
          "All of the above"
        ],
        answer: 3
      },
      {
        id: "qa-3",
        text: "Preferred file exchange practice with consultants:",
        choices: [
          "Random file names each week",
          "Consistent naming convention with version/date and transmittal",
          "No transmittal",
          "Screenshots only"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "site",
    title: "Site, Detailing & Graphics",
    questions: [
      {
        id: "st-1",
        text: "Spot elevation label +/- 102.350 refers to:",
        choices: [
          "Ceiling height",
          "Height relative to project datum/benchmark",
          "Room area",
          "Wall thickness"
        ],
        answer: 1
      },
      {
        id: "st-2",
        text: "Lineweight hierarchy for readability should prioritize:",
        choices: [
          "Projection lines heavier than cut",
          "Cut lines heavier than projection; annotation clearly legible",
          "All lines equal",
          "Hatches heavier than cut"
        ],
        answer: 1
      },
      {
        id: "st-3",
        text: "A properly referenced section marker should:",
        choices: [
          "Float without sheet reference",
        "Include sheet/detail reference and align with key plans or grids",
          "Be hidden",
          "Use random orientation"
        ],
        answer: 1
      }
    ]
  }
];

const SCALE_ITEMS = [
  { id: "sr-autocad", label: "AutoCAD production (2D/Sheet Set)" },
  { id: "sr-revit", label: "Revit/BIM (families, worksharing)" },
  { id: "sr-bluebeam", label: "Bluebeam (markups, takeoff)" },
  { id: "sr-sketchup", label: "SketchUp/V‑Ray (viz support)" },
  { id: "sr-acc", label: "BIM 360/Autodesk Construction Cloud" },
  { id: "sr-docs", label: "Construction docs (RFIs/ASIs/shop dwgs)" },
  { id: "sr-code", label: "Codes & standards (AHJ process)" }
];

function useInterval(callback, delay) {
  const savedRef = useRef(callback);
  useEffect(() => { savedRef.current = callback; }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [answers, setAnswers] = useState({}); // {qid: choiceIndex}
  const [scale, setScale] = useState({}); // {id: 1..5}
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [showResults, setShowResults] = useState(false);

  // Load any saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && (obj.answers || obj.scale)) {
          setAnswers(obj.answers || {});
          setScale(obj.scale || {});
          setTimeLeft(obj.timeLeft ?? 25 * 60);
          setResumed(true);
        }
      }
    } catch {}
  }, []);

  // Autosave
  useEffect(() => {
    const payload = JSON.stringify({ answers, scale, timeLeft });
    try { localStorage.setItem(STORAGE_KEY, payload); } catch {}
  }, [answers, scale, timeLeft]);

  // Timer only runs when started and not showing results
  useInterval(
    () => {
      setTimeLeft((t) => {
        if (!started || showResults) return t;
        return Math.max(0, t - 1);
      });
    },
    started && !showResults ? 1000 : null
  );

  useEffect(() => {
    if (timeLeft === 0 && started) {
      setShowResults(true);
    }
  }, [timeLeft, started]);

  const allKnowledge = useMemo(() => SECTIONS.flatMap((s) => s.questions), []);
  const totalKnowledge = allKnowledge.length; // 25
  const totalScale = SCALE_ITEMS.length; // 7
  const answeredKnowledge = allKnowledge.filter((q) => answers[q.id] != null).length;
  const answeredScale = SCALE_ITEMS.filter((s) => scale[s.id] != null).length;
  const progress = Math.round(((answeredKnowledge + answeredScale) / (totalKnowledge + totalScale)) * 100);

  function selectAnswer(qid, idx) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  function selectScale(id, val) {
    setScale((prev) => ({ ...prev, [id]: val }));
  }

  function resetTest() {
    setAnswers({});
    setScale({});
    setTimeLeft(25 * 60);
    setStarted(false);
    setShowResults(false);
    setResumed(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  function scoreResults() {
    const bySection = SECTIONS.map((sec) => {
      const correct = sec.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
      return { id: sec.id, title: sec.title, correct, total: sec.questions.length };
    });
    const knowledgeScore = bySection.reduce((a, s) => a + s.correct, 0);
    const selfAvg = SCALE_ITEMS.reduce((a, s) => a + (Number(scale[s.id]) || 0), 0) / (SCALE_ITEMS.length || 1);

    const band = knowledgeScore >= 20 ? "Senior‑ready" : knowledgeScore >= 13 ? "Intermediate" : "Junior";

    return { bySection, knowledgeScore, selfAvg: Number.isFinite(selfAvg) ? selfAvg : 0, band };
  }

  const { bySection, knowledgeScore, selfAvg, band } = useMemo(() => scoreResults(), [answers, scale]);

  function exportResults() {
    const data = {
      timestamp: new Date().toISOString(),
      progress,
      knowledgeScore,
      totalKnowledge,
      band,
      sectionBreakdown: bySection,
      selfRatings: SCALE_ITEMS.map((s) => ({ id: s.id, label: s.label, value: scale[s.id] ?? null }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ATSAT-results.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copySummary() {
    const lines = [];
    lines.push(`ATSAT Result — ${band}`);
    lines.push(`Knowledge: ${knowledgeScore}/${totalKnowledge}`);
    bySection.forEach((s) => lines.push(`${s.title}: ${s.correct}/${s.total}`));
    lines.push(`Self‑rating avg: ${selfAvg.toFixed(1)} / 5`);
    const text = lines.join("\\n");
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">Architectural Technician Self‑Assessment — ATSAT</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tabular-nums px-2 py-1 rounded bg-neutral-100 border border-neutral-200">{Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}</span>
            <button onClick={resetTest} className="text-sm px-3 py-1.5 rounded bg-white border border-neutral-300 hover:bg-neutral-100">Reset</button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="w-full h-2 bg-neutral-200 rounded">
            <div className="h-2 bg-neutral-900 rounded" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-neutral-600 mt-1">
            <span>Progress {progress}%</span>
            <span>Knowledge {answeredKnowledge}/{totalKnowledge} · Self {answeredScale}/{totalScale}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!started ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm leading-6 text-neutral-700">This timed assessment covers core production skills across AutoCAD, Revit/BIM, Bluebeam, construction documents, coordination, and site/detailing, plus a short self‑rating.
              You have <span className="font-semibold">25 minutes</span>. Autosave is enabled on this device.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => { setStarted(true); setShowResults(false); }} className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:opacity-90">Start</button>
              {resumed && (
                <button onClick={() => { setStarted(true); setShowResults(false); }} className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100">Resume Saved Session</button>
              )}
            </div>
            <div className="mt-4 text-xs text-neutral-500">Tip: Click Reset to start fresh. Finish & Score at the bottom when ready.</div>
          </div>
        ) : (
          <>
            {SECTIONS.map((sec) => (
              <section key={sec.id} className="mb-6">
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{sec.title}</h2>
                    <span className="text-xs text-neutral-600">{sec.questions.filter(q => answers[q.id] != null).length}/{sec.questions.length} answered</span>
                  </div>
                  <div className="p-5 space-y-4">
                    {sec.questions.map((q, i) => (
                      <div key={q.id} className="rounded-xl border border-neutral-200 p-4">
                        <div className="text-sm font-medium mb-2">{i + 1}. {q.text}</div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.choices.map((c, idx) => {
                            const selected = answers[q.id] === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => selectAnswer(q.id, idx)}
                                className={`text-left px-3 py-2 rounded-lg border transition ${selected ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-300"}`}
                              >
                                <span className="text-sm leading-5">{c}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            <section className="mb-6">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Self‑Ratings (1 = learning · 5 = can lead)</h2>
                  <span className="text-xs text-neutral-600">{answeredScale}/{totalScale} set</span>
                </div>
                <div className="p-5 space-y-3">
                  {SCALE_ITEMS.map((s) => (
                    <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 border border-neutral-200 rounded-xl p-3">
                      <div className="sm:w-1/2 text-sm font-medium">{s.label}</div>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map((v) => (
                          <button key={v} onClick={() => selectScale(s.id, v)}
                            className={`w-9 h-9 rounded-full border ${scale[s.id]===v?"border-neutral-900 ring-1 ring-neutral-900":"border-neutral-200 hover:border-neutral-300"}`}>
                            <span className="text-sm font-medium">{v}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowResults(true)} className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:opacity-90">Finish & Score</button>
              <button onClick={exportResults} className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100">Export JSON</button>
              <button onClick={copySummary} className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100">Copy Summary</button>
            </div>

            {showResults && (
              <section className="mt-6">
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="px-5 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold">Results</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded bg-neutral-100 border border-neutral-200">Knowledge: {knowledgeScore}/{totalKnowledge}</span>
                      <span className="text-sm px-2 py-1 rounded bg-neutral-100 border border-neutral-200">Band: {band}</span>
                      <span className="text-sm px-2 py-1 rounded bg-neutral-100 border border-neutral-200">Self‑rating avg: {selfAvg.toFixed(1)}/5</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {bySection.map((s) => (
                        <div key={s.id} className="border border-neutral-200 rounded-xl p-3">
                          <div className="text-sm font-medium mb-1">{s.title}</div>
                          <div className="text-sm">{s.correct} / {s.total} correct</div>
                          <div className="w-full h-2 bg-neutral-200 rounded mt-2">
                            <div className="h-2 bg-neutral-900 rounded" style={{ width: `${Math.round((s.correct/s.total)*100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Plain‑Sight Summary: Knowledge {knowledgeScore}/{totalKnowledge}, Band {band}, Self‑avg {selfAvg.toFixed(1)}/5.
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-xs text-neutral-500">
        ATSAT v1 — local, private, device‑saved. Refresh‑safe.
      </footer>
    </div>
  );
}
