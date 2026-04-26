import React from 'react';

const CATEGORY_ORDER = ['Greatsword', 'Handcannon', 'Arts Unit', 'Sword', 'Polearm'];

const WeaponCard = React.memo(({ w, priorities, togglePriority }) => (
    <div key={w.name} className="col-xl-6">
        <div className={`weapon-card priority-${priorities[w.name]}`} onClick={() => togglePriority(w.name)}>
            <div className={`card-accent accent-${w.rarity}`}></div>
            {priorities[w.name] === 2 && <span className="star-icon">★</span>}
            
            <div className="d-flex align-items-center">
                <div className={`weapon-img-container img-bg-${w.rarity}`}>
                    <img src={`images/weapon_${w.name.toLowerCase().replace(/ /g, '_').replace(/:/g, '').replace(/'/g, '')}.png`} className="weapon-img" alt="" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64/111/444?text=' + w.name[0]; }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                    <div className={`fw-bold text-truncate ${priorities[w.name] === 2 ? 'color-p2' : (priorities[w.name] === 1 ? 'color-p1' : 'color-p0')}`} style={{fontSize: '1rem'}}>{w.name}</div>
                    <div className="d-flex align-items-center mt-1">
                        <span className={`color-${w.rarity}-rarity`} style={{fontSize: '0.8rem', fontWeight: 'bold'}}>{w.rarity}★</span>
                        <span className="mx-2 text-muted">|</span>
                        <span className={`text-uppercase color-${w.rarity}-rarity`} style={{fontSize: '0.7rem'}}>{w.type}</span>
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex flex-wrap gap-1">
                <span className="stat-badge">{w.attr_stat}</span>
                <span className="stat-badge">{w.sec_stat}</span>
                <span className="stat-badge">{w.skill_stat}</span>
            </div>
        </div>
    </div>
));

const WeaponList = ({ groupedWeapons, priorities, togglePriority, filter, setFilter, setShowResetModal }) => (
    <div className="col-lg-6">
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="m-0 fw-bold"><img src="images/smolrey.png" alt="Smolrey" loading="lazy" style={{width: '32px', height: '32px', marginRight: '8px'}} />ESSENCE TARGETS<img src="images/smolrey.png" alt="Smolrey" loading="lazy" style={{width: '32px', height: '32px', marginLeft: '8px'}} /></h3>
                <button className="reset-btn" onClick={() => setShowResetModal(true)}>RESET</button>
            </div>
            <div className="d-flex gap-2 align-items-center">
                <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 'bold'}}>SEARCH:</span>
                <input type="text" className="form-control form-control-sm bg-dark text-light border-secondary" placeholder="..." value={filter} onChange={e => setFilter(e.target.value)} style={{flex: 1}} />
            </div>
        </div>
        
        <div className="pe-2">
            {CATEGORY_ORDER.map(cat => (
                groupedWeapons[cat].length > 0 && (
                    <div key={cat}>
                        <div className="category-header mb-3">
                            <img src={`images/weaponcategory_${cat.toLowerCase().replace(' ', '_')}.png`} className="category-icon" alt="" loading="lazy" />
                            <span className="text-uppercase fw-bold" style={{letterSpacing: '2px', fontSize: '0.9rem'}}>{cat}S</span>
                        </div>
                        <div className="row g-3">
                            {groupedWeapons[cat].map(w => <WeaponCard key={w.name} w={w} priorities={priorities} togglePriority={togglePriority} />)}
                        </div>
                    </div>
                )
            ))}
        </div>
    </div>
);

export default React.memo(WeaponList);