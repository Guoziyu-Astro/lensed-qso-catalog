'use strict';
const $ = id => document.getElementById(id);
const state = { records: [], selectedImages: {}, paperImages: {}, columns: [], filtered: [], sort: 'catalog_id', direction: 1, page: 1 };
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const missing = value => value === null || value === undefined || value === '';
// Display-only translations; source records and downloads remain unchanged.
const englishValues = {
  "3椭圆星系复合透镜": "Compound lens with three elliptical galaxies",
  "Agnello和Lemon都在2018，选了月份靠前的": "Both Agnello and Lemon were published in 2018; the earlier month was selected.",
  "Hagen et al. 1999只是探测类星体，没有看到有关透镜星系的描述， Chantry et al. 2010直接当作引力透镜类星体建模": "Hagen et al. (1999) detected the quasar; no description of a lens galaxy was found. Chantry et al. (2010) modelled it as a gravitationally lensed quasar.",
  "Rhoads et al. 1996引用中提到的Patnaik et al. 1992，没有链接": "Patnaik et al. (1992) is cited by Rhoads et al. (1996); no link is available.",
  "~0.7（文献估计）": "~0.7 (literature estimate)",
  "两个质量相当的螺旋星系": "Two spiral galaxies of comparable mass",
  "双透镜系统": "Double-lens system",
  "复合透镜": "Compound lens",
  "多星系": "Multiple galaxies",
  "射电发现": "Radio discovery",
  "很严谨的标准": "Very strict criteria",
  "找不到文章具体内容，无法确认，沿用catalogue": "The full paper could not be located for verification; the catalogue entry was retained.",
  "星系团": "Galaxy cluster",
  "最早出现引用的Djorgovski et al. 2000没有出版，Cox et al. 2002直接用了": "The earliest cited work, Djorgovski et al. (2000), was unpublished; Cox et al. (2002) used it directly.",
  "有光谱": "Spectroscopy available",
  "极有可能": "Highly likely",
  "标题未说明candidate，但文章说了存疑": "The title does not say candidate, but the paper expresses uncertainty.",
  "标题没说candidate": "The title does not say candidate.",
  "椭圆星系+星系团？": "Elliptical galaxy + galaxy cluster?",
  "盘": "Disk",
  "盘星系": "Disk galaxy",
  "近乎边缘朝向的旋涡星系": "Nearly edge-on spiral galaxy",
  "还有一个发现未记录在本表格中": "One additional discovery is not included in this table.",
  "透镜星系光谱信噪比过低，无法测量红移": "Lens spectrum S/N too low to measure the redshift."
};
const englishValue = value => Object.hasOwn(englishValues, value) ? englishValues[value] : value;
const display = value => missing(value) ? '<span class="missing">—</span>' : escapeHTML(englishValue(value));
const normalize = value => String(value ?? '').normalize('NFKC').replace(/[−–—]/g, '-').toLowerCase().replace(/\s/g, '');
function number(value) {
  const s = String(value ?? '').trim().replace(/−/g, '-');
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s) ? Number(s) : null;
}
function safeURL(value) {
  try { const url = new URL(String(value)); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
function fillSelect(id, key, descending = false) {
  const values = [...new Set(state.records.map(r => r[key]).filter(v => !missing(v)).map(String))];
  values.sort((a,b) => a.localeCompare(b, 'en', {numeric:true}) * (descending ? -1 : 1));
  for (const value of values) { const option = document.createElement('option'); option.value = value; option.textContent = value; $(id).append(option); }
  const empty = document.createElement('option'); empty.value = '__missing'; empty.textContent = 'Not available'; $(id).append(empty);
}
function matchSelect(id, record, key) { const value = $(id).value; return !value || (value === '__missing' ? missing(record[key]) : String(record[key]) === value); }
function applyFilters() {
  const query = normalize($('search').value);
  const min = number($('z-min').value), max = number($('z-max').value);
  state.filtered = state.records.filter(r => {
    if (query && !['name','alt_name','first discovered','note','ADS link','catalog_id'].some(key => (normalize(r[key]).includes(query) || normalize(englishValue(r[key])).includes(query)))) return false;
    if (!matchSelect('images',r,'n_img') || !matchSelect('year',r,'year')) return false;
    const z = number(r.z_source);
    return (min === null && max === null) || (z !== null && (min === null || z >= min) && (max === null || z <= max));
  });
  state.page = 1;
  render();
}
function render() {
  const key = state.sort;
  const sortValue = record => {
    if (key === 'paper_reference') return state.paperImages[String(record.row_number)]?.reference;
    if (key === 'image_source') {
      const image = state.selectedImages[String(record.row_number)];
      return image?.status === 'ok' ? image.source_label : null;
    }
    return ['name', 'first discovered'].includes(key) ? record[key] : number(record[key]);
  };
  state.filtered.sort((a,b) => {
    const av = sortValue(a), bv = sortValue(b);
    if (missing(av)) return missing(bv) ? a.row_number - b.row_number : 1;
    if (missing(bv)) return -1;
    return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'en', {numeric:true})) * state.direction || a.row_number - b.row_number;
  });
  const size = $('page-size').value === 'all' ? Math.max(1,state.filtered.length) : Number($('page-size').value);
  const pages = Math.max(1,Math.ceil(state.filtered.length / size));
  state.page = Math.min(state.page,pages);
  const start = (state.page-1)*size;
  const records = state.filtered.slice(start,start+size);
  $('rows').innerHTML = records.map(r => {
    const url = safeURL(r['ADS link']);
    const image = state.selectedImages[String(r.row_number)];
    const thumbnail = image?.status === 'ok' ? `<button class="thumbnail-button" data-image-row="${r.row_number}" aria-label="View image of ${escapeHTML(r.name)}"><img src="${escapeHTML(image.thumbnail)}" alt="${escapeHTML(r.name)} · ${escapeHTML(image.source_label)}" width="128" height="128" loading="lazy"></button>` : '<span class="missing">No image available</span>';
    const paper = state.paperImages[String(r.row_number)];
    const paperURL = safeURL(paper?.reference_url);
    const paperThumbnail = paper ? `<a class="thumbnail-button" href="${escapeHTML(paper.path)}" target="_blank" rel="noopener noreferrer" aria-label="View paper image of ${escapeHTML(r.name)}"><img src="${escapeHTML(paper.path)}" alt="${escapeHTML(r.name)} · ${escapeHTML(paper.reference)}" width="128" height="128" loading="lazy"></a>${paperURL ? `<a class="paper-source" href="${escapeHTML(paperURL)}" target="_blank" rel="noopener noreferrer">${escapeHTML(paper.reference)}</a>` : ''}` : '<span class="missing">No image available</span>';
    return `<tr><td>${display(r.catalog_id)}</td><td><button class="record-name" data-row="${r.row_number}">${display(r.name)}</button>${!missing(r.alt_name) ? `<div class="alias" title="${escapeHTML(r.alt_name)}">${escapeHTML(r.alt_name)}</div>` : ''}</td><td class="thumbnail-cell">${thumbnail}</td><td class="thumbnail-cell">${paperThumbnail}</td><td class="numeric">${display(r.ra)}</td><td class="numeric">${display(r.dec)}</td><td class="numeric"><span class="redshift-value">${display(r.z_lens)}</span></td><td class="numeric"><span class="redshift-value">${display(r.z_source)}</span></td><td><span class="image-count ${Number(r.n_img) >= 4 ? 'quad' : ''}">${display(r.n_img)}</span></td><td>${display(r.year)}</td><td>${url ? `<a class="citation" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${display(r['first discovered'] || 'Reference')} <span>↗</span></a>` : `<span class="citation">${display(r['first discovered'])}</span>`}</td></tr>`;
  }).join('');
  $('result-count').innerHTML = `<b>${state.filtered.length}</b> of ${state.records.length} records`;
  $('empty').hidden = state.filtered.length > 0;
  $('page-range').textContent = state.filtered.length ? `${start+1}–${Math.min(start+size,state.filtered.length)} of ${state.filtered.length}` : 'No results';
  $('page-label').textContent = `${state.page} / ${pages}`;
  $('prev').disabled = state.page === 1; $('next').disabled = state.page === pages;
  $('export').disabled = state.filtered.length === 0;
  for (const button of document.querySelectorAll('[data-sort]')) {
    button.parentElement.removeAttribute('aria-sort');
    const old = button.querySelector('.sort-arrow'); if (old) old.remove();
    const arrow = document.createElement('span'); arrow.className = 'sort-arrow'; arrow.setAttribute('aria-hidden','true');
    arrow.textContent = '↕';
    const nextDirection = button.dataset.sort === key && state.direction === 1 ? 'descending' : 'ascending';
    const label = button.textContent.trim();
    button.setAttribute('aria-label',`${label}: sort ${nextDirection}${button.dataset.sort === 'image_source' ? ' (by survey name)' : ''}`);
    if (button.dataset.sort === key) {
      button.parentElement.setAttribute('aria-sort',state.direction === 1 ? 'ascending' : 'descending');
      arrow.textContent = state.direction === 1 ? '↑' : '↓';
    }
    button.append(arrow);
  }
}
function reset() { for (const id of ['search','images','year','z-min','z-max']) $(id).value = ''; applyFilters(); }
function detail(row) {
  const r = state.records.find(record => record.row_number === Number(row)); if (!r) return;
  const labels = {catalog_id:'ID',original_id:'Original ID',name:'System',alt_name:'Aliases',HSC:'HSC', 'DESI-LS':'DESI-LS','paper image':'Publication image field',ra:'RA (deg)',dec:'Dec (deg)',z_lens:'Lens redshift',z_source:'Source redshift',image_sep:'Image separation (as recorded)',n_img:'Number of images', 'first discovered':'Discovery reference',year:'Discovery year', 'ADS link':'Reference URL',note:'Notes',source_type:'Source type (as recorded)',lens_type:'Lens type (as recorded)'};
  $('detail-content').innerHTML = `<h2>${escapeHTML(r.name)}</h2><p class="detail-subtitle">ID ${escapeHTML(r.catalog_id)} · Original ID ${escapeHTML(r.original_id)} · Worksheet 1, row ${r.row_number}</p><dl class="detail-grid">${state.columns.filter(k=>k!=='name').map(key => {
    const url = safeURL(r[key]);
    return `<div class="${['note','ADS link','alt_name'].includes(key) ? 'wide' : ''}"><dt>${escapeHTML(labels[key] || key)}</dt><dd>${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r[key])} ↗</a>` : display(r[key])}</dd></div>`;
  }).join('')}</dl>`;
  $('details').showModal();
}
function downloadCSV() {
  const cell = value => {
    let s = String(value ?? '');
    if (/^[=+@]/.test(s) || (/^-/.test(s) && number(s) === null)) s = "'" + s;
    return '"' + s.replace(/"/g,'""') + '"';
  };
  const csv = '\ufeff' + [state.columns, ...state.filtered.map(r=>state.columns.map(c=>r[c]))].map(row=>row.map(cell).join(',')).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = `lensed_qso_filtered_${state.filtered.length}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
for (const id of ['search','z-min','z-max']) $(id).addEventListener('input',applyFilters);
for (const id of ['images','year']) $(id).addEventListener('change',applyFilters);
$('page-size').addEventListener('change',()=>{state.page=1;render();});
$('prev').addEventListener('click',()=>{state.page--;render();}); $('next').addEventListener('click',()=>{state.page++;render();});
$('reset').addEventListener('click',reset); $('empty-reset').addEventListener('click',reset);
$('export').addEventListener('click',downloadCSV);
$('copy-citation').addEventListener('click', async () => {
  const text = $('paper-citation').textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    $('citation-status').textContent = 'Citation copied';
  } catch {
    const range = document.createRange(); range.selectNodeContents($('paper-citation'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    $('citation-status').textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
  }
});
$('rows').addEventListener('click',e=>{const imageButton=e.target.closest('[data-image-row]');if(imageButton){showCatalogImages(state.records.find(r=>r.row_number===Number(imageButton.dataset.imageRow)),state.selectedImages[imageButton.dataset.imageRow]);return;}const button=e.target.closest('[data-row]');if(button)detail(button.dataset.row);});
$('close-detail').addEventListener('click',()=>$('details').close());
$('details').addEventListener('click',e=>{if(e.target===$('details')){const r=$('details').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('details').close();}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('details').open&&!$('image-dialog').open){e.preventDefault();$('search').focus();}});
for (const button of document.querySelectorAll('[data-sort]')) {
  button.querySelector('span')?.remove();
  button.addEventListener('click',()=>{state.direction=state.sort===button.dataset.sort?-state.direction:1;state.sort=button.dataset.sort;state.page=1;render();});
}
async function init() {
  try {
    const response = await fetch('data/catalog.json'); if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data = await response.json(); state.records=data.records;state.columns=data.meta.columns;
    const imagesResponse = await fetch('data/selected_images.json');
    if(imagesResponse.ok)state.selectedImages=(await imagesResponse.json()).records;
    const papersResponse = await fetch('data/images.json');
    if (papersResponse.ok) {
      imageManifest = await papersResponse.json();
      for (const [row, entries] of Object.entries(imageManifest.records)) {
        const paper = entries.find(entry => entry.source_column === 'paper image');
        if (paper) state.paperImages[row] = paper;
      }
    }
    fillSelect('images','n_img');fillSelect('year','year',true);
    applyFilters();
  } catch(error) { $('result-count').textContent='Unable to load the catalogue. Please reload the page.'; console.error(error); }
}
init();
