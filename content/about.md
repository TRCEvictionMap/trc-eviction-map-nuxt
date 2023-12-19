---
title: About - Eviction Map - Tenant Resource Center
---

# About the map

This map combines eviction filing data from court records with data from the U.S. Census to provide an up to date, historical view of where evictions are (and aren't) happening in Dane County, Wisconsin.


## Eviction data

The eviction data represented on the map was collected from Wisconsin circuit court's online case management [system portal](https://wcca.wicourts.gov/). Eviction is a process initiated by a landlord against a tenant which often results in the forced or coerced removal of the tenant from the leased property. Although many eviction procedings result in court filings, many do not. This means that our map provides an incomplete picture of evictions in Dane County. 

In Wisconsin,

> the legal eviction process begins when the landlord serves the tenant a written notice under Wis. Stat. 704.17 stating how the tenant has violated the lease. This may be a 5-day, 14-day or 30-day notice. This is not a court document and does not go in the court records at this point, only the landlord's files. It is a warning that the landlord may take the tenant to court if they don't move out or do what the notice asks them to do. ([Tenant Resource Center](https://www.tenantresourcecenter.org/about_eviction))

If a tenant served with an eviction notice by their landlord moves out before a court case is filed, their eviction will not show up our data. [Illegal evictions](https://www.tenantresourcecenter.org/illegal_self_help_evictions) will also not appear in our data.


## Mapping eviction data

Each eviction court filing record includes a defendant address and a filing date. We used Google's [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview#how-the-geocoding-api-works) to determine latitude and longitude coordinates for each of these addresses. With these coordinates, we can plot the physical location of the homes of each person who had an eviction case filed against them on a map.

This in itself would illuminate the degree to which evictions are geographically concentrated. But by [using PostGIS to overlay](https://postgis.net/workshops/postgis-intro/joins.html#spatial-joins) the defendant address coordinates on top of geographic boundaries used by the U.S. Census, we can calculate and present annual eviction filing counts and rates alongside demographic data produced by the [American Community Survey (ACS)](https://www.census.gov/data/developers/data-sets/acs-5year.html) to paint a richer picture of eviction filings and population characteristics across all Census [Block Groups](https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4) in Dane County.

The map represents the following metrics:

| Metric                        | Description                                                                                                                               |
| ---                           | ---                                                                                                                                       |
| _Eviction Filings_            | The number of eviction filings where the defendant address listed in the court record falls inside the geographic area of a block group.  | 
| _Renter Occupied Households_  | The number of renter-occupied households in a block group.                                                                                |
| _Eviction Filing Rate_        | A ratio representing the number of eviction filings for every 100 renter-occupied households in a block group.                            |
| _Percent Renter Occupied_     | The percentage of renter-occupied households in a block group.                                                                            |

We use [ACS 5-Year estimates](https://www.census.gov/data/developers/data-sets/acs-5year.html) of the number of [renter-occupied and owner-occupied households](https://data.census.gov/table?q=B25008&g=050XX00US55025$1500000) in each block group that were published in 2021. This means that _Eviction Filing Rate_ values calculated for years other than 2021 may be less reliable. We will update the map to use more current estimates [as they become available](https://www.census.gov/programs-surveys/acs/news/data-releases.html).


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