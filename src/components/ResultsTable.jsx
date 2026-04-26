import React from 'react';

const Tooltip = React.memo(({ weapon, uniqueId }) => (
    <div className="stat-tooltip" style={{ display: uniqueId ? 'block' : undefined }}>
        <div className="d-flex flex-column gap-1">
            <span className="stat-badge w-100 m-0">{weapon.attr_stat}</span>
            <span className="stat-badge w-100 m-0">{weapon.sec_stat}</span>
            <span className="stat-badge w-100 m-0">{weapon.skill_stat}</span>
        </div>
    </div>
));

const ResultsTable = ({ results, setSelectedResult, activeTooltip, setActiveTooltip }) => (
    <div className="col-lg-6">
        <div className="sticky-results">
            <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="m-0 fw-bold">ESSENCE MATCHES</h3>
            </div>
            <div className="results-card bg-opacity-50">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 results-table">
                        <thead className="text-uppercase" style={{fontSize: '0.75rem', color: '#aaa'}}>
                            <tr>
                                <th className="ps-3 py-3" style={{width: '35%'}}>Location / Engravings</th>
                                <th className="py-3 pe-3">Weapon Essences</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={i} onClick={() => setSelectedResult(r)}>
                                    <td className="ps-3 py-3">
                                        <div className="fw-bold mb-1" style={{fontSize: '1.1rem', color: '#a0d8ef'}}>{r.location}</div>
                                        <div className="mb-2" style={{fontSize: '0.75rem'}}>
                                            <span className="text-uppercase" style={{letterSpacing: '0.5px', color: '#aaa'}}>Matches: </span>
                                            <span className="color-p2 fw-bold">{r.p2Count}</span>
                                            <span className="mx-1 text-muted opacity-50">|</span>
                                            <span className="color-p1 fw-bold">{r.p1Count}</span>
                                            <span className="mx-1 text-muted opacity-50">|</span>
                                            <span className="color-p0 fw-bold">{r.p0Count}</span>
                                        </div>
                                        <div className="d-flex flex-wrap gap-1 align-items-center">
                                            {r.attrItems.map((a, ai) => (
                                                <span key={ai} className="stat-badge" style={{color: '#888'}}>{a}</span>
                                            ))}
                                            <span className="stat-badge" style={{color: '#888'}}>{r.selItem}</span>
                                        </div>
                                    </td>
                                    <td className="align-middle pe-3">
                                        <div className="outcome-row">
                                            <div className="weapon-container-right">
                                                {r.p2List.map(o => {
                                                    const uid = `p2-${i}-${o.name}`;
                                                    return (
                                                        <span key={uid} 
                                                            className="weapon-name-box color-p2"
                                                            onMouseEnter={(e) => { e.stopPropagation(); setActiveTooltip(uid); }}
                                                            onMouseLeave={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
                                                            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === uid ? null : uid); }}
                                                        >
                                                            {o.name}
                                                            <Tooltip weapon={o} uniqueId={activeTooltip === uid ? uid : null} />
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="outcome-row">
                                            <div className="weapon-container-right">
                                                {r.p1List.map(o => {
                                                    const uid = `p1-${i}-${o.name}`;
                                                    return (
                                                        <span key={uid} 
                                                            className="weapon-name-box color-p1"
                                                            onMouseEnter={(e) => { e.stopPropagation(); setActiveTooltip(uid); }}
                                                            onMouseLeave={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
                                                            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === uid ? null : uid); }}
                                                        >
                                                            {o.name}
                                                            <Tooltip weapon={o} uniqueId={activeTooltip === uid ? uid : null} />
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="outcome-row">
                                            <div className="weapon-container-right">
                                                {r.p0List.map(o => {
                                                    const uid = `p0-${i}-${o.name}`;
                                                    return (
                                                        <span key={uid} 
                                                            className="weapon-name-box color-p0"
                                                            onMouseEnter={(e) => { e.stopPropagation(); setActiveTooltip(uid); }}
                                                            onMouseLeave={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
                                                            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === uid ? null : uid); }}
                                                        >
                                                            {o.name}
                                                            <Tooltip weapon={o} uniqueId={activeTooltip === uid ? uid : null} />
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default React.memo(ResultsTable);