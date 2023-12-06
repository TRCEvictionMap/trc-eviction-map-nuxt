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

A block group is a statistial geographical unit used by the U.S. Census to present data and is the smallest area for which demographic characteristics are produced from the American Community Survey (ACS).[]{cid=glsry-bg}[]{cid=psap-guide}[]{cid=acs-about}


### Representing evictions geographically

As of this writing, the map uses 4 key metrics to represent eviction and demographic characteristics across Dane County. We use [block groups](#block-groups) as the statistical geographical unit to organize these metrics.

| Metric                        | Description                                                                                           |
| ---                           | ---                                                                                                   |
| _Eviction Filings_            | The number of eviction filings where the defendant's address is in a block group.                     | 
| _Eviction Filing Rate_        | Represents the number of eviction filings for every 100 renter-occupied households in a block group.  |
| _Percent Renter Occupied_     | The percentage of renter-occupied households in a block group.                                        |
| _Renter Occupied Households_  | The number of renter-occupied households in a block group.                                            |

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

    - id: acs-about
      author: U.S. Census Buerau
      pageTitle: About the American Community Survey
      pageUrl: https://www.census.gov/programs-surveys/acs/about.html

    - id: glsry-bg
      author: U.S. Census Bureau
      pageTitle: Glossary - Block Group
      pageUrl: https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4

    - id: psap-guide
      author: U.S. Census Bureau
      pageTitle: 2020 Census Participant Statistical Areas Program (PSAP) Information Guide
      pageUrl: https://www2.census.gov/geo/pdfs/partnerships/psap/PSAP-InfoGuide.pdf
      year: 2018
---
::