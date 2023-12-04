---
title: About - Eviction Map - Tenant Resource Center
---

# About the map

This map combines demographic and geographic data from the US Census [American Community Survey (ACS)](https://www.census.gov/programs-surveys/acs/about.html) and [TIGER/Line Shapefiles](https://www.census.gov/geographies/mapping-files.html) with eviction case data from Wisconsin circuit court's online case management system portal to show demographic and geographic patterns in eviction court filings over time in Dane County, WI.

It is a project of the [Tenant Resource Center (TRC)](https://www.tenantresourcecenter.org/) and was developed by [Jacob Albright](https://jacobalbright.com) and Philip Wales.


## Data and Methods

### Evictions
The eviction data represented on the map was collected from Wisconsin circuit court's online case management system portal. Although many eviction procedings result in small claims court filings, many do not. This means that our map provides an incomplete picture of evictions in Dane County.

<!-- Eviction is a process initiated by a landlord against a tenant which often results in the forced or coerced removal of the tenant from the leased property.  -->

In Wisconsin,

> the legal eviction process begins when the landlord serves the tenant a written notice under Wis. Stat. 704.17 stating how the tenant has violated the lease. This may be a 5-day, 14-day or 30-day notice. This is not a court document and does not go in the court records at this point, only the landlord's files. It is a warning that the landlord may take the tenant to court if they don't move out or do what the notice asks them to do. [(TRC - About Eviction)](https://www.tenantresourcecenter.org/about_eviction)

Because of this and [illegal evictions](https://www.tenantresourcecenter.org/illegal_self_help_evictions)






### Block Groups


A block group is a statistical geographical unit used by the U.S. Census Bureau to present data and generally contain between 600 and 3000 people.[]{cid=glsry-bg} The U.S. Census Bureau publishes data from the ACS and decennial census tabulated by block group.

<!-- ### Housing occupancy


We combine U.S. Census data tabulated by Block Group with 

We use block groups as our geographic and statistical unit to calulate and display demographic and eviction characterists across Dane County

The housing occupancy numbers we use to caluclate eviction rates are tabulated by block group and  We use housing occupancy 5-year estimates from the ACS tabulated by

### Tablulating evictions

Each case record includes the defendant's address and the status or outcome of the case.

 -->




## How we collected data




## How we 






### 


<!-- All of our eviction data comes from small claims court eviction case records[]{cid=ccap}. Each eviction case record includes the street address of the plaintiff (the person against whom the eviction filed).  -->




## Limitations







Using housing occupancy[]{cid=tbl-ho}, geographic[]{cid=shp-bg}[]{cid=shp-tr}, and eviction case[]{cid=ccap} data, we calculated  

Housing occupancy data[]{cid=tbl-ho} tells 



Using [PostGIS](https://postgis.net/),


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

    - id: glsry-bg
      author: U.S. Census Bureau
      pageTitle: Glossary - Block Group
      pageUrl: https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4


---
    <!-- - id: trc-about-eviction
      author: Tenant Resource Center
      pageTitle: About Eviction
      pageUrl: https://www.tenantresourcecenter.org/about_eviction -->
::