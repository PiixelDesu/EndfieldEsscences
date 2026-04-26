import React from 'react';

const CompactWeapon = React.memo(({ w, priorities }) => {
    const p = priorities[w.name];
    const colorClass = p === 2 ? 'color-p2' : (p === 1 ? 'color-p1' : 'color-p0');
    return (
        <div className="col-md-6 col-12 mb-2">
            <div className="compact-weapon-card">
                <div className={`weapon-img-container img-bg-${w.rarity}`} style={{width: '40px', height: '40px', minWidth: '40px'}}>
                    <img src={`images/weapon_${w.name.toLowerCase().replace(/ /g, '_').replace(/:/g, '').replace(/'/g, '')}.png`} className="weapon-img" alt="" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40/111/444?text=' + w.name[0]; }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                    <div className={`fw-bold text-truncate ${colorClass}`} style={{fontSize: '0.9rem'}}>{w.name}</div>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                        <span className="stat-badge">{w.attr_stat}</span>
                        <span className="stat-badge">{w.sec_stat}</span>
                        <span className="stat-badge">{w.skill_stat}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const ResultModal = ({ selectedResult, closeModals }) => {
    if (!selectedResult) return null;

    return (
        <div className="custom-modal-overlay" onClick={closeModals}>
            <div className="custom-modal" onClick={e => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                    <div>
                        <h4 className="m-0 color-p1">{selectedResult.location}</h4>
                        <div className="d-flex flex-wrap gap-1 mt-2 align-items-center">
                            <span style={{fontSize: '0.7rem', color: '#666', fontWeight: 'bold'}}>ENGRAVINGS:</span>
                            {selectedResult.attrItems.map((a, ai) => (
                                <span key={ai} className="stat-badge" style={{color: '#888'}}>{a}</span>
                            ))}
                            <span className="stat-badge" style={{color: '#888'}}>{selectedResult.selItem}</span>
                        </div>
                    </div>
                    <button className="btn-close btn-close-white" onClick={closeModals}></button>
                </div>
                
                {selectedResult.p2List.length > 0 && (
                    <div className="mb-4">
                        <h6 className="text-uppercase color-p2 mb-3" style={{letterSpacing: '1px'}}>Priority Essences ({selectedResult.p2Count})</h6>
                        <div className="row g-2">
                            {selectedResult.p2List.map(w => <CompactWeapon key={w.name} w={w} priorities={selectedResult.priorities || {}} />)}
                        </div>
                    </div>
                )}
                
                {selectedResult.p1List.length > 0 && (
                    <div className="mb-4">
                        <h6 className="text-uppercase color-p1 mb-3" style={{letterSpacing: '1px'}}>Matched Essences ({selectedResult.p1Count})</h6>
                        <div className="row g-2">
                            {selectedResult.p1List.map(w => <CompactWeapon key={w.name} w={w} priorities={selectedResult.priorities || {}} />)}
                        </div>
                    </div>
                )}

                {selectedResult.p0List.length > 0 && (
                    <div>
                        <h6 className="text-uppercase color-p0 mb-3" style={{letterSpacing: '1px'}}>Untracked Essences ({selectedResult.p0Count})</h6>
                        <div className="row g-2">
                            {selectedResult.p0List.map(w => (
                                <div key={w.name} className="col-md-4 col-6">
                                    <div className="small color-p0 opacity-75">• {w.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ResultModal);