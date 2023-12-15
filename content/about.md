---
title: About - Eviction Map - Tenant Resource Center
---

# About the map

This map combines data from the U.S. Census with eviction case data from Wisconsin circuit court's online case management system portal to show demographic and geographic patterns in eviction court filings over time in Dane County, WI.


## Data and Methods

### Evictions

Eviction is a process initiated by a landlord against a tenant which often results in the forced or coerced removal of the tenant from the leased property. The eviction data represented on the map was collected from Wisconsin circuit court's online case management system portal.[]{cid=ccap}[]{cid=trc-about-ccap} Although many eviction procedings result in court filings, many do not. This means that our map provides an incomplete picture of evictions in Dane County. 

In Wisconsin,

> the legal eviction process begins when the landlord serves the tenant a written notice under Wis. Stat. 704.17 stating how the tenant has violated the lease. This may be a 5-day, 14-day or 30-day notice. This is not a court document and does not go in the court records at this point, only the landlord's files. It is a warning that the landlord may take the tenant to court if they don't move out or do what the notice asks them to do.[]{cid=trc-about-eviction}

If a tenant served with an eviction notice by their landlord moves out before a court case is filed, their eviction will not show up our data. Illegal evictions will also not appear in our data.[]{cid=trc-illegal-eviction}


### Block Groups

A block group is a statistial geographical unit used by the U.S. Census to present data and is the smallest area for which demographic characteristics are produced from the American Community Survey (ACS).[]{cid=glsry-bg}[]{cid=acs-5-year-data}


### Representing eviction cases geographically

As of this writing, the map uses 4 metrics to represent eviction and demographic characteristics across Dane County. We use [block groups](#block-groups) as the statistical geographical unit to organize these metrics.

| Metric                        | Description                                                                                                                               |
| ---                           | ---                                                                                                                                       |
| _Eviction Filings_            | The number of eviction filings where the defendant address listed in the court record falls inside the geographic area of a block group.  | 
| _Eviction Filing Rate_        | A ratio representing the number of eviction filings for every 100 renter-occupied households in a block group.                            |
| _Renter Occupied Households_  | The number of renter-occupied households in a block group.                                                                                |
| _Percent Renter Occupied_     | The percentage of renter-occupied households in a block group.                                                                            |

#### Eviction Filings

In the most baisc terms, we used GIS software to determine the geographic coordinates of each _eviction filing_'s defendant address and then overlay those coordinates on the geographic boundaries of Dane County block groups to count how many occurred inside each.

We used Google's Geocoding API to determine the latitude and longitude of each _eviciton filing_'s defendant address.[]{cid=google-geocode-api}

We used PostGIS to overlay each of these coordnates on block group boundaries and count how many occurred each year.[]{cid=postgis-spatial-joins}[]{cid=shp-bg}



<!-- 

Each eviction filing record includes a defendant address and a filing date.

Counting the number of evictions filed in each block group for each year we have eviction filing data


We used PostGIS, an open source geographic information

Each eviction filing record includes a defendant address and a filing date. Using these two pieces of information, we counted the number of annual filings in each block group. This process involved the following steps:

To 

1. _Geocode each defendant address._ We used Google's Geocoding API to determine the latitude and longitude of each defendant address.[]{cid=google-geocode-api} We 
2. _Spatially join_



This is the process of converting an address (_e.g._ 123 Fake Street, Madison, WI) into geographic coordinates. We used Google's geocoding API to accomplish 


We determined the latitude and longitude of each address. Then, we used PostGIS, open source geographic information system (GIS) software, to overlay the geographic boundaries 

Each eviction filing includes a defendant address and a filing date. Using these two pieces of information, we counted annual eviction filings in each block group. This involved the following steps:

1. Convert each defendant address into geographic coordinates
2. Overlay these coordinates on the areas

the number of eviction 

The map shows the number of eviction filings in each block group for every year we have eviction filing data.


We used PostGIS – open source geographic information system (GIS) software – to overlay the geographic coordinates of each eviction filing's defendant address on the geographic areas of Dane County block groups. 



Each eviction case record includes a defendant address and a filing date. We geocoded each of these addresses to convert them into geographic coordinates.  Next, we used PostGIS – open source geographic information system (GIS) software – to overlay these coordinates with the geographic areas Dane County block groups to determine determine how many evictions were filed in each.[]{cid=postgis-spatial-joins}[]{cid=shp-bg} Finally, we grouped these counts by filing year.
 -->




<!-- Eviction case
- Street address
- Geographic point

Block group
- Geographic area

PostGIS spatial join
- count the number of eviction cases whose coordinates fall inside the area of a given block group and then group these totals by year -->


#### Renter Occupied Households

The ACS produces estimates of the numbers of renter-occupied and owner-occupied households in each block group.[]{cid=tbl-ho}[] As of this writing, the map uses ACS 5-year estimates published in 2021. This means that _Eviction Filing Rate_ values calculated for years other than 2021 are less reliable than those calculated for 2021. We will update the map to use more current data as it becomes available.[]{cid=acs-release-schedule}


#### Eviction Filing Rate



[\[...work in progress\]]

## Who made this

This map is a project of the [Tenant Resource Center](https://www.tenantresourcecenter.org/) and was developed by [Jacob Albright](https://jacobalbright.com) and Philip Wales.


## References

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
::