# Lensed QSO Catalogue

A searchable catalogue of 343 lensed quasar records with survey cutouts, sortable columns, filters, and CSV/Excel downloads.

## Citation

If you use this catalogue or a subset, please cite:

Guo, Z., Chen, Y., Shu, Y., Gao, J., Li, H., He, Z., & Wang, J. (2026).
*New dynamical measurements from a lensed quasar sample: joint analysis constrains the mass profile evolution of lens galaxies.*
Monthly Notices of the Royal Astronomical Society, 549(4), stag1029.
[doi:10.1093/mnras/stag1029](https://doi.org/10.1093/mnras/stag1029).

Questions or feedback: Ziyu Guo, [zyguo@pmo.ac.cn](mailto:zyguo@pmo.ac.cn).

## Website

Public site: https://guoziyu-astro.github.io/lensed-qso-catalog/

The website is served from `site/`. Search, filtering, sorting and CSV export run in the browser; no backend or build dependencies are required. Excel is served directly as a static file.

To preview locally:

```sh
python3 -m http.server 8787 --bind 127.0.0.1 --directory site
```

Open `http://127.0.0.1:8787/`.

The workflow in `.github/workflows/pages.yml` publishes `site/` to GitHub Pages after changes to `main`. In repository Settings → Pages, the publishing source is **GitHub Actions**.

## Data and images

- IDs 1–343 follow the original worksheet row order and remain fixed when sorting or filtering. The original identifiers and worksheet rows are retained in `site/data/catalog.json`.
- Website translations are display-only; JSON, CSV and Excel retain their original scientific content. Bibliographic references and classifications have not all been independently verified.
- Images are selected in HST → JWST → Euclid → ground-survey order. The 2026-11-01 search replaced 217 thumbnails with usable HST images; 126 retain HSC PDR3, DES DR2, Legacy Surveys or Pan-STARRS images. No additional JWST or Euclid image was selected after applying the HST priority and image-quality checks.
- Space images are real FITS science cutouts, north up and east left. Usable multi-band HST images are shown as wavelength-mapped colour composites; single usable bands remain grayscale. Three filters map from short to long wavelength into blue, green and red. With two filters, blue/red are observed bands and green is their blend. This is a display-balanced composite, not calibrated photometric colour.
- The 2026-11-01 colour pass produced 109 composites (55 with three filters and 54 with two); 108 HST images remain grayscale because no additional usable, reliably aligned band was found.
- Colour bands are reprojected using their WCS, checked and registered against shared sources, and approximately matched in effective resolution before compositing. Filter mappings and per-band archive links are shown in the image dialog. Empty products, inadequate coverage, insufficient central contrast, unreliable registration and visually identified trails are excluded. This display selection is not a lens confirmation or a measured resolution ranking.
- `site/data/selected_images.json` records archive URLs, datasets, filters, proposals, fields of view, WCS and checksums. `site/data/space_image_search.json` records per-target search decisions. Ground images remain archived, with their paths retained in replaced entries.
- `site/data/hst_colour_search.json` records the colour-image decisions, source products, alignment checks and display mapping. Previously selected grayscale HST images remain archived as well.
- Original workbook images and their provenance are in `site/data/images.json`. They may include published models or annotations.
- Source imagery remains subject to the respective surveys' and publications' terms. This repository does not grant additional rights to third-party material.
