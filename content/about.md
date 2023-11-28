---
title: About - Eviction Map - Tenant Resource Center
---

## Introduction

This map combines demographic and geographic data from the US Census [American Community Survey (ACS)](https://www.census.gov/programs-surveys/acs/about.html) and [TIGER/Line Shapefiles](https://www.census.gov/geographies/mapping-files.html) with eviction data from Wisconsin circuit court's online case management system portal to show demographic and geographic patterns in eviction filings over time in Dane County, WI.

It is a project of the [Tenant Resource Center](https://www.tenantresourcecenter.org/) and was developed by [Jacob Albright](https://jacobalbright.com) and Philip Wales.


## Methods



Using housing occupancy[]{citeref=1}, geographic[]{citeref=2}[]{citeref=3}, and eviction case[]{citeref=4} data, we calculated  

Housing occupancy data[]{citeref=1} tells 

All of our eviction data comes from small claims court eviction case records[]{citeref=4}. Each eviction case record includes the street address of the plaintiff (the person against whom the eviction filed). We 



Using [PostGIS](https://postgis.net/),


## References

<ol>

::Footnote
---
number: 1
author: U.S. Census Bureau
pageTitle: "Table B25008: TOTAL POPULATION IN OCCUPIED HOUSING UNITS BY TENURE"
pageUrl: https://data.census.gov/table?q=B25008&g=050XX00US55025$1500000
year: 2021
---
::

::Footnote
---
number: 2
author: U.S. Census Bureau
pageTitle: 2022 TIGER/Line Shapefiles Block Groups
pageUrl: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=Block+Groups
year: 2022
---
::

::Footnote
---
number: 3
author: U.S. Census Bureau
pageTitle: 2022 TIGER/Line Shapefiles Census Tracts
pageUrl: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=Census+Tracts
year: 2022
---
::

::Footnote
---
number: 4
author: Wisconsin Circuit Court Access
pageTitle: Access to the public records of the Wisconsin circuit courts
pageUrl: https://wcca.wicourts.gov/
---
::

</ol>
