# Lensed QSO Catalogue

A searchable catalogue of 343 lensed quasar records with survey cutouts, sortable columns, filters, and CSV downloads.

## Citation

If you use this catalogue or a subset, please cite:

Guo, Z., Chen, Y., Shu, Y., Gao, J., Li, H., He, Z., & Wang, J. (2026).
*New dynamical measurements from a lensed quasar sample: joint analysis constrains the mass profile evolution of lens galaxies.*
Monthly Notices of the Royal Astronomical Society, 549(4), stag1029.
[doi:10.1093/mnras/stag1029](https://doi.org/10.1093/mnras/stag1029).

Questions or feedback: Ziyu Guo, [zyguo@pmo.ac.cn](mailto:zyguo@pmo.ac.cn).

## Website

Public site: https://guoziyu-astro.github.io/lensed-qso-catalog/

The website is served from `site/`. Search, filtering, sorting and CSV export run in the browser; no backend or build dependencies are required.

To preview locally:

```sh
python3 -m http.server 8787 --bind 127.0.0.1 --directory site
```

Open `http://127.0.0.1:8787/`.

The workflow in `.github/workflows/pages.yml` publishes `site/` to GitHub Pages after changes to `main`. In repository Settings → Pages, the publishing source is **GitHub Actions**.

## Data and images

- IDs 1–343 follow the original worksheet row order and remain fixed when sorting or filtering. The original identifiers and worksheet rows are retained in `site/data/catalog.json`.
- Website translations are display-only. The 2026-11-01 bibliography revision corrects confirmed author/reference, URL and year problems in 40 records. Eleven records retain specific pending-review notes (seven also have a confirmed correction). Main-table `Reference pending` links open the record details. JSON, CSV and the separately delivered updated Excel contain the same revised references and notes. Other scientific values and IDs are preserved.
- `site/data/reference-review.json` records before/after values, evidence and unresolved questions for the 44 flagged entries. This is a bounded bibliography revision, not a complete first-discovery-priority or physical-classification audit. The year follows the cited publication; preprints are labelled, and confirmation papers with unresolved earlier candidates are flagged.
- Images are selected in HST → JWST → Euclid → ground-survey order. The 2026-11-01 search replaced 217 thumbnails with usable HST images; 126 retain HSC PDR3, DES DR2, Legacy Surveys or Pan-STARRS images. No additional JWST or Euclid image was selected after applying the HST priority and image-quality checks.
- Space images are real FITS science cutouts, north up and east left. Usable multi-band HST images are shown as wavelength-mapped colour composites; single usable bands remain grayscale. Three filters map from short to long wavelength into blue, green and red. With two filters, blue/red are observed bands and green is their blend. This is a display-balanced composite, not calibrated photometric colour.
- The 2026-11-01 colour pass produced 109 composites (55 with three filters and 54 with two); 108 HST images remain grayscale because no additional usable, reliably aligned band was found.
- Colour bands are reprojected using their WCS, checked and registered against shared sources, and approximately matched in effective resolution before compositing. Filter mappings and per-band archive links are shown in the image dialog. Empty products, inadequate coverage, insufficient central contrast, unreliable registration and visually identified trails are excluded. This display selection is not a lens confirmation or a measured resolution ranking.
- `site/data/selected_images.json` records archive URLs, datasets, filters, proposals, fields of view, WCS and checksums. `site/data/space_image_search.json` records per-target search decisions. Ground images remain archived, with their paths retained in replaced entries.
- `site/data/hst_colour_search.json` records the colour-image decisions, source products, alignment checks and display mapping. Previously selected grayscale HST images remain archived as well.
- The optional gallery now contains a verified publication observation for all 343 systems (2026-11-01): 153 previously missing images were added and 32 inherited screenshots were retraced or replaced. The main table shows one preferred survey image and a separate Paper image column per system. Paper image thumbnails open the larger publication crop; the citation below each thumbnail links to the image source. The column sorts by the image-source reference.
- Publication sources, figure identifiers and inspection notes are in `site/data/paper-provenance.json` and `site/data/images.json`. Two observations (IDs 71 and 82) come from the online candidate catalogue explicitly linked by Dawes et al. (2023), rather than numbered figures in the article. Some published observations retain contours or catalogue-position overlays. Model-only and residual panels are excluded from the publication-image selection.
- The old HE0512-3329 screenshot (ID 76) showed a different target and has been replaced. The exact origin of the old screenshots for IDs 100 and 318 remained unresolved; both were replaced with correctly identified publication observations. Image citations identify the actual image source, which may differ from the catalogue discovery-reference field. The later bibliography revision corrects the confirmed reference mismatches while retaining unresolved first-discovery questions. Physical classifications are unchanged.
- Source imagery remains subject to the respective surveys' and publications' terms. This repository does not grant additional rights to third-party material.
