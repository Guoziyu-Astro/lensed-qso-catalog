# Lensed QSO Catalogue

A searchable catalogue of 359 lensed quasar/AGN records with survey cutouts, sortable columns, filters, and CSV/Excel downloads.

This catalogue is a product of the work presented in Guo et al. (2026) and is continually updated.

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

- IDs 1–343 follow the original worksheet row order and remain fixed when sorting or filtering. The original identifiers and worksheet rows are retained in `site/data/catalog.json`. IDs 344–359 were appended on 2026-11-02; no original-upload identifier is invented for these additions.
- The 2026-11-02 addition contains 16 evidence-supported systems present in GraL X but absent from the original catalogue: 11 conventional quasars and five explicitly labelled special AGN/radio sources. `site/data/additions-review.json` gives the per-object evidence and coordinate/separation provenance. Candidate reports and later confirmation are distinguished. The entries include COOLJ1153A only, not the different-redshift source COOLJ1153B. Existing entries and duplicates are retained, so 359 is a record count, not a new claim of 359 independently verified unique systems or sample completeness.
- `site/downloads/lensed_quasar.xlsx` now contains the same 359 records and bibliography as JSON/CSV, while preserving the original 343 rows, worksheet structure and 1,443 embedded images. No illustrations were added for the 16 new rows; blank survey fields and “Image not added” do not mean no survey coverage. Their type and confirmation notes are available in each record's details and downloads.
- Reproduction for this bounded addition: the workspace script `outputs/lensed_qso_confirmed_additions_20261102/prepare_additions.py` starts from the frozen 343-record snapshot; `build_workbook.mjs` appends to the latest 2026-11-01 priority-reviewed workbook with Artifact Tool. `preserve_package.py` transfers the authored rows and table extent while preserving all other original OOXML parts. `validate_additions.py` checks the saved workbook, prior rows/styles/images and CSV/JSON consistency before `sync_site.py` stages publication. Later revisions should use the new 359-record catalogue as their base rather than rerunning the historical original-workbook exporter.
- Website translations are display-only. The initial 2026-11-01 bibliography revision corrected author/reference, URL and year problems in 40 records and left eleven priority questions. The subsequent target-specific review distinguishes candidate reports, reported lens identifications, and confirmation: seven histories now have checked public-source chains; four retain explicit gaps (IDs 118, 170, 179, 208). Main-table `Discovery history` and `Reference pending` links open the details. JSON, CSV and the separately delivered updated Excel contain the same revised references and notes. Other scientific values and IDs are preserved.
- `site/data/reference-review.json` records before/after values, evidence and unresolved questions for the 44 flagged entries. This is a bounded bibliography revision, not a complete first-discovery-priority or physical-classification audit. The year follows the cited publication; preprints are labelled, and confirmation papers with unresolved earlier candidates are flagged.
- `site/data/discovery-histories.json` contains the eleven follow-up histories and primary-source links. The original 44-record audit remains in `reference-review.json`, with a separate `priority_followup` recording the new changes. Candidate and confirmation reports are separate fields in CSV and Excel; the main year remains the cited publication year. “First public” uses version submission dates for arXiv, publication dates for journal-only records, and retains month/year precision where appropriate. These are the earliest located sources, not a claim of exhaustive historical priority. A paper-level date is not an independently verified release timestamp for each entry of an external catalogue.
- ID 208 needs identity reconciliation: its KiDS name/coordinates match the Khramtsov 2019 candidate, while the inherited SDSS alias and Jaelani 2021 confirmation are about 5.5 arcsec away. The paper-image association is visibly flagged. Inherited coordinates, redshift and image pixels are retained but are not endorsed as a verified cross-identification.
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
