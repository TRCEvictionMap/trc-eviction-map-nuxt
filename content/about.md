---
title: About - Eviction Map - Tenant Resource Center
---

# About the map

This map combines eviction filing data from court records with data from the U.S. Census to provide an up to date, historical view of where evictions are (and aren't) happening in Dane County, Wisconsin.

## What is eviction

Eviction is a process landlords may begin when they believe a tenant has violated their lease, and they want the tenant to fix the problem or move out. 

The process usually begins with a notice giving the tenant at least 5 days to fix the problem, and may eventually end up in small claims court. There, a judge will decide whether the tenant has to move out (eviction); they get to stay (dismissal); or the case will be dismissed by mutual agreement (stipulation), usually for a payment plan or a move-out date.

It is important to remember that in Wisconsin a tenant can only be forced to leave an apartment after they have a court date, and only if the judge rules in the landlord's favor. Then the judge's order must be given to the sheriff who would then remove the tenant from the apartment. The landlord cannot change the locks, throw the tenant's stuff out, or take any other action without this court order. The sheriff is the only person who can physically remove the tenant.

Eviction is a major driver of housing insecurity. It can result in the expulsion of families from their homes and communities; force tenants to fall back on unhealthy or dangerous living situations; and cause serious economic, emotional, and physical harm. Single-mothers, African Americans, and low-income households disproportionately face eviction.

## Our eviction data

The eviction data represented on the map comes from public court records created when landlords file for eviction. These records tell us when evictions were filed and where the people they were filed against lived. We used these court records to calculate all eviction numbers shown on the map.

Although many eviction proceedings result in court filings, many do not. For example, cases where a tenant moved out after recieving an eviction notice but before their landlord filed for eviction in court will not show up in our numbers. This means that the map provides an incomplete picture of evictions in Dane County.


## Mapping evictions

Each eviction court filing record includes a defendant address and a filing date. We used Google's [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview#how-the-geocoding-api-works) to determine latitude and longitude coordinates for each of these addresses. With these coordinates, we can plot the physical location of the homes of each person who had an eviction case filed against them on a map.

This in itself would illuminate the degree to which evictions are geographically concentrated. But by [using PostGIS to overlay](https://postgis.net/workshops/postgis-intro/joins.html#spatial-joins) the defendant address coordinates on top of geographic boundaries used by the U.S. Census, we can calculate and present annual eviction filing counts and rates alongside demographic data produced by the [American Community Survey (ACS)](https://www.census.gov/data/developers/data-sets/acs-5year.html) and [Decennial Census](https://www.census.gov/programs-surveys/decennial-census/about.html) to paint a richer picture of eviction filings and population characteristics across all Census [Block Groups](https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4) in Dane County.



## Who made this

This map is a project of the [Tenant Resource Center](https://www.tenantresourcecenter.org/) and was developed by [Jacob Albright](https://jacobalbright.com) and Philip Wales.


<!-- ## References

::FootnoteList
---
items:
    - id: tbl-ho
      author: U.S. Census Bureau
      pageTitle: "Table B25008: TOTAL POPULATION IN OCCUPIED HOUSING UNITS BY TENURE"
      pageUrl: https://data.census.gov/table?q=B25008&g=050XX00US55025$1500000
      year: 2021

    - id: shp-bg
      author: U.S. Census Bureau
      pageTitle: 2022 TIGER/Line Shapefiles Block Groups
      pageUrl: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=Block+Groups
      year: 2022

    - id: shp-tr
      author: U.S. Census Bureau
      pageTitle: 2022 TIGER/Line Shapefiles Census Tracts
      pageUrl: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=Census+Tracts
      year: 2022

    - id: ccap
      author: Wisconsin Circuit Court Access
      pageTitle: Access to the public records of the Wisconsin circuit courts
      pageUrl: https://wcca.wicourts.gov/

    - id: trc-about-ccap
      author: Tenant Resource Center
      pageTitle: "CCAP: The Good, the Bad, and the Ugly"
      pageUrl: https://www.tenantresourcecenter.org/ccap_the_good_the_bad_and_the_ugly
      year: 2022
    
    - id: trc-about-eviction
      author: Tenant Resource Center
      pageTitle: About Eviction
      pageUrl: https://www.tenantresourcecenter.org/about_eviction

    - id: trc-illegal-eviction
      author: Tenant Resource Center
      pageTitle: Illegal, "Self-Help" Evictions
      pageUrl: https://www.tenantresourcecenter.org/illegal_self_help_evictions

    - id: acs-5-year-data
      author: U.S. Census Buerau
      pageTitle: American Community Survey 5-Year Data (2009-2022)
      pageUrl: https://www.census.gov/data/developers/data-sets/acs-5year.html
      year: 2023

    - id: acs-release-schedule
      author: U.S. Census Buerau
      pageTitle: Data Releases
      pageUrl: https://www.census.gov/programs-surveys/acs/news/data-releases.html

    - id: glsry-bg
      author: U.S. Census Bureau
      pageTitle: Glossary - Block Group
      pageUrl: https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4

    - id: postgis-spatial-joins
      author: PostGIS
      pageTitle: Introduction to PostGIS - Spatial Joins
      pageUrl: https://postgis.net/workshops/postgis-intro/joins.html#spatial-joins
      year: 2023

    - id: google-geocode-api
      author: Google Maps Platform
      pageTitle: How the Geocoding API works
      pageUrl: https://developers.google.com/maps/documentation/geocoding/overview#how-the-geocoding-api-works
      year: 2023

---
:: -->