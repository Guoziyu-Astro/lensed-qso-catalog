'use strict';
const imageUI = id => document.getElementById(id);
let imageManifest, imageGeneration = 0;
async function showCatalogImages(record, selected) {
  const generation=++imageGeneration;
  imageUI('image-title').textContent=record.name+' · Image';
  imageUI('image-coordinates').textContent=`Catalogue coordinates: RA ${record.ra}°, Dec ${record.dec}°`;
  imageUI('original-images').open=false;
  const available=selected?.status==='ok';
  imageUI('selected-figure').hidden=!available;
  imageUI('selected-download').hidden=!available;
  const provenance=imageUI('image-provenance');provenance.replaceChildren();
  if(available){
    imageUI('selected-image').src=selected.image;
    imageUI('selected-image').alt=record.name+' · '+selected.source_label;
    imageUI('selected-open').href=selected.image;
    imageUI('selected-download').href=selected.image;
    imageUI('selected-download').download=record.name+'-'+selected.source+'.jpg';
    const grayscale=selected.selection_mode==='single_band_fallback'||selected.selection_mode==='space_single_band';
    const colour=selected.selection_mode==='space_multiband';
    imageUI('selected-caption').textContent=selected.metadata.caption||`${selected.source_label} · ${selected.fov_arcsec}″ × ${selected.fov_arcsec}″ · ${colour?`${selected.metadata.band_count}-band colour composite`:grayscale?'grayscale':selected.metadata.bands}`;
    if(selected.metadata.display_note)provenance.append(selected.metadata.display_note+' ');
    if(selected.selection_mode==='space_single_band'){
      const details=[selected.metadata.instrument,selected.metadata.proposal_id?`Proposal ${selected.metadata.proposal_id}`:null].filter(Boolean);
      provenance.append(details.join(' · '));
    }
    if(colour){
      const map=selected.metadata.rgb_mapping;
      provenance.append(`R: ${map.red} · G: ${selected.metadata.band_count===2?'blend of both bands':map.green} · B: ${map.blue}. `);
    }
    if(selected.selection_mode==='single_band_fallback')provenance.append(`Full colour unavailable; showing a grayscale ${selected.metadata.bands}-band image.`);
    else if(selected.metadata.coverage_note)provenance.append('The centre is faint; valid observed pixels are present.');
    if(selected.higher_priority_errors)provenance.append('A higher-priority survey request failed; this image is provisional.');
    for(const [i,url] of selected.metadata.urls.entries()){
      const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';
      if(colour){const band=selected.metadata.band_details[i];link.title=[band.instrument,band.proposal_id?`Proposal ${band.proposal_id}`:null].filter(Boolean).join(' · ');}
      link.textContent=colour?` ${selected.metadata.band_details[i].band} source`:selected.metadata.urls.length===1?' Source':` Source ${i+1}`;provenance.append(' ',link);
    }
  }else provenance.textContent='No survey cutout available.';
  const container=imageUI('workbook-images');container.textContent='Loading workbook images…';
  imageUI('image-dialog').showModal();
  try{
    if(!imageManifest){const response=await fetch('data/images.json?v=60e640932de0c3fa');if(!response.ok)throw Error();imageManifest=await response.json();}
    if(generation!==imageGeneration)return;
    container.replaceChildren();
    const entries=imageManifest.records[String(record.row_number)]||[];
    for(const entry of entries){
      const figure=document.createElement('figure'),link=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption');
      const label=entry.source_column==='paper image'?'Publication image':entry.source_column;
      link.href=entry.path;link.target='_blank';link.rel='noopener noreferrer';
      img.src=entry.path;img.alt=`${record.name}, ${label}`;
      img.loading='lazy';img.width=entry.width;img.height=entry.height;
      caption.textContent=entry.reference?`${label} · ${entry.reference}`:`${label} · Original workbook cell ${entry.anchor_cell}`;
      if(entry.reference_url){const source=document.createElement('a');source.href=entry.reference_url;source.target='_blank';source.rel='noopener noreferrer';source.textContent=' Paper';caption.append(source);}
      link.append(img);figure.append(link,caption);container.append(figure);
    }
    if(!entries.length)container.textContent='No workbook images available for this record.';
  }catch{if(generation===imageGeneration)container.textContent='Unable to load workbook images.';}
}
imageUI('close-images').addEventListener('click',()=>imageUI('image-dialog').close());
imageUI('image-dialog').addEventListener('close',()=>{imageGeneration++;});
