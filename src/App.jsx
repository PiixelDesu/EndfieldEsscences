import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

const CATEGORY_ORDER = ['Greatsword', 'Handcannon', 'Arts Unit', 'Sword', 'Polearm'];

const ResetModal = React.lazy(() => import('./components/ResetModal'));
const ResultModal = React.lazy(() => import('./components/ResultModal'));
const WeaponList = React.lazy(() => import('./components/WeaponList'));
const ResultsTable = React.lazy(() => import('./components/ResultsTable'));

function App() {
    const [data, setData] = useState(null);
    const [priorities, setPriorities] = useState(() => {
        const saved = localStorage.getItem('endfield_priorities_v5');
        return saved ? JSON.parse(saved) : null;
    });
    const [filter, setFilter] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [activeTooltip, setActiveTooltip] = useState(null);

    useEffect(() => {
        fetch('data.json')
            .then(res => res.json())
            .then(json => {
                setData(json);
                if (!priorities) {
                    const initial = {};
                    json.weapons.forEach(w => { initial[w.name] = w.rarity === 3 ? 0 : 1; });
                    setPriorities(initial);
                }
            });
    }, []);

    useEffect(() => {
        if (priorities) {
            localStorage.setItem('endfield_priorities_v5', JSON.stringify(priorities));
        }
    }, [priorities]);

    useEffect(() => {
        const handlePopState = (e) => {
            if (selectedResult || showResetModal) {
                setSelectedResult(null);
                setShowResetModal(false);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [selectedResult, showResetModal]);

    useEffect(() => {
        if (selectedResult || showResetModal) {
            if (!window.history.state?.modal) {
                window.history.pushState({ modal: true }, '');
            }
        }
    }, [selectedResult, showResetModal]);

    const closeModals = () => {
        if (selectedResult || showResetModal) {
            setSelectedResult(null);
            setShowResetModal(false);
            if (window.history.state?.modal) {
                window.history.back();
            }
        }
    };

    const confirmReset = () => {
        const initial = {};
        data.weapons.forEach(w => { initial[w.name] = w.rarity === 3 ? 0 : 1; });
        setPriorities(initial);
        closeModals();
    };

    const togglePriority = (name) => {
        setPriorities(prev => {
            const curr = prev[name];
            const next = curr === 1 ? 2 : (curr === 2 ? 0 : 1);
            return { ...prev, [name]: next };
        });
    };

    const combinations = (array, k) => {
        const result = [];
        const fn = (start, combo) => {
            if (combo.length === k) { result.push(combo); return; }
            for (let i = start; i < array.length; i++) { fn(i + 1, [...combo, array[i]]); }
        };
        fn(0, []);
        return result;
    };

    const attributes = ['Strength', 'Agility', 'Will', 'Intellect', 'Main Attribute'];
    const attrCombos = useMemo(() => combinations(attributes, 3), []);

    const results = useMemo(() => {
        if (!data || !priorities) return [];
        const solverResults = [];
        const locations = data.alluvium;

        Object.entries(locations).forEach(([locName, locData]) => {
            const selections = [
                ...locData.secondary.map(s => ({ type: 'secondary', val: s })),
                ...locData.skill.map(s => ({ type: 'skill', val: s }))
            ];

            selections.forEach(sel => {
                attrCombos.forEach(attrSel => {
                    const p2Outcomes = [];
                    const p1Outcomes = [];
                    const p0Outcomes = [];
                    
                    data.weapons.forEach(w => {
                        if (!attrSel.includes(w.attr_stat)) return;

                        const isMatch = sel.type === 'secondary' 
                            ? ((w.sec_stat === sel.val || w.rarity === 3) && locData.skill.includes(w.skill_stat))
                            : (w.skill_stat === sel.val && (w.rarity === 3 || locData.secondary.includes(w.sec_stat)));

                        if (isMatch) {
                            const p = priorities[w.name] ?? 1;
                            if (p === 2) p2Outcomes.push(w);
                            else if (p === 1) p1Outcomes.push(w);
                            else p0Outcomes.push(w);
                        }
                    });

                    if (p2Outcomes.length > 0 || p1Outcomes.length > 0) {
                        const score = (p2Outcomes.length * 1000) + (p1Outcomes.length * 1) + (p0Outcomes.length * 0.001);
                        solverResults.push({
                            location: locName,
                            attrItems: attrSel,
                            selItem: sel.val,
                            score: score,
                            p2Count: p2Outcomes.length,
                            p1Count: p1Outcomes.length,
                            p0Count: p0Outcomes.length,
                            p2List: p2Outcomes,
                            p1List: p1Outcomes,
                            p0List: p0Outcomes
                        });
                    }
                });
            });
        });

        const anyP2Selected = Object.values(priorities).some(p => p === 2);
        let filtered = solverResults;
        
        if (anyP2Selected) {
            filtered = solverResults.filter(r => r.p2Count > 0);
        }
        
        filtered = filtered.filter(r => r.p2Count > 0 || r.p1Count > 0);

        return filtered.sort((a, b) => b.score - a.score).slice(0, 100);
    }, [data, priorities]);

    const groupedWeapons = useMemo(() => {
        if (!data) return {};
        const groups = {};
        CATEGORY_ORDER.forEach(cat => groups[cat] = []);
        data.weapons.forEach(w => {
            if (w.name.toLowerCase().includes(filter.toLowerCase())) groups[w.type]?.push(w);
        });
        Object.keys(groups).forEach(cat => {
            groups[cat].sort((a, b) => {
                if (a.rarity !== b.rarity) return b.rarity - a.rarity;
                return a.name.localeCompare(b.name);
            });
        });
        return groups;
    }, [data, filter]);

    if (!data || !priorities) return <div className="loading-overlay">Loading Data...</div>;

    return (
        <div className="container-fluid py-4">
            <React.Suspense fallback={<div>Loading...</div>}>
                <ResetModal showResetModal={showResetModal} closeModals={closeModals} confirmReset={confirmReset} />
                <ResultModal selectedResult={selectedResult} closeModals={closeModals} />
            </React.Suspense>

            <div className="row g-4">
                <React.Suspense fallback={<div>Loading...</div>}>
                    <WeaponList groupedWeapons={groupedWeapons} priorities={priorities} togglePriority={togglePriority} filter={filter} setFilter={setFilter} setShowResetModal={setShowResetModal} />
                    <ResultsTable results={results} setSelectedResult={setSelectedResult} activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                </React.Suspense>
            </div>
        </div>
    );
}

export default App;