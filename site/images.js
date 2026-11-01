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
    imageUI('selected-caption').textContent=`${selected.source_label} · ${selected.fov_arcsec}″ × ${selected.fov_arcsec}″ · ${selected.selection_mode==='single_band_fallback'?'grayscale':selected.metadata.bands}`;
    if(selected.selection_mode==='single_band_fallback')provenance.append(`Full colour unavailable; showing a grayscale ${selected.metadata.bands}-band image.`);
    else if(selected.metadata.coverage_note)provenance.append('The centre is faint; valid observed pixels are present.');
    if(selected.higher_priority_errors)provenance.append('A higher-priority survey request failed; this image is provisional.');
    for(const [i,url] of selected.metadata.urls.entries()){
      const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';
      link.textContent=selected.metadata.urls.length===1?' Source':` Source ${i+1}`;provenance.append(' ',link);
    }
  }else provenance.textContent='No survey cutout available.';
  const container=imageUI('workbook-images');container.textContent='Loading workbook images…';
  imageUI('image-dialog').showModal();
  try{
    if(!imageManifest){const response=await fetch('data/images.json');if(!response.ok)throw Error();imageManifest=await response.json();}
    if(generation!==imageGeneration)return;
    container.replaceChildren();
    const entries=imageManifest.records[String(record.row_number)]||[];
    for(const entry of entries){
      const figure=document.createElement('figure'),link=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption');
      const label=entry.source_column==='paper image'?'Publication image':entry.source_column;
      link.href=entry.path;link.target='_blank';link.rel='noopener noreferrer';
      img.src=entry.path;img.alt=`${record.name}, workbook cell ${entry.anchor_cell}, ${label}`;
      img.loading='lazy';img.width=entry.width;img.height=entry.height;
      caption.textContent=`${label} · Workbook cell ${entry.anchor_cell}`;
      link.append(img);figure.append(link,caption);container.append(figure);
    }
    if(!entries.length)container.textContent='No workbook images available for this record.';
  }catch{if(generation===imageGeneration)container.textContent='Unable to load workbook images.';}
}
imageUI('close-images').addEventListener('click',()=>imageUI('image-dialog').close());
imageUI('image-dialog').addEventListener('close',()=>{imageGeneration++;});
