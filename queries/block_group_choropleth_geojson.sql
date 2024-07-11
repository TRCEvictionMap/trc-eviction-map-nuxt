with p2_race as (
  select
    tract,
    block_group,
    (data -> 'P2_001N')::float total,
    --  !!Total:!!Hispanic or Latino
    (data -> 'P2_002N')::float hispanic_latino,
    --  !!Total:!!Not Hispanic or Latino:
    (data -> 'P2_003N')::float not_hispanic_latino,
    --  !!Total:!!Not Hispanic or Latino:!!Population of one race:!!White alone
    (data -> 'P2_005N')::float white,
    --  !!Total:!!Not Hispanic or Latino:!!Population of one race:!!Black or African American alone
    (data -> 'P2_006N')::float black,
    --  !!Total:!!Not Hispanic or Latino:!!Population of one race:!!American Indian and Alaska Native alone
    (data -> 'P2_007N')::float american_indian,
    --  !!Total:!!Not Hispanic or Latino:!!Population of one race:!!Asian alone
    (data -> 'P2_008N')::float asian,
    --  !!Total:!!Population of one race:!!Native Hawaiian and Other Pacific Islander alone
    (data -> 'P2_009N')::float pacific_islander,
    --  !!Total:!!Not Hispanic or Latino:!!Population of one race:!!Some Other Race alone
    (data -> 'P2_010N')::float other,
    --  !!Total:!!Not Hispanic or Latino:!!Population of two or more races:
    (data -> 'P2_011N')::float multi
  from (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data
    where code = 'P2' and year = '2020'
  ) t
),
block_group_demographics as (
  select
    tenure.block_group,
    tenure.tract,
    (tenure.data -> 'B25008_003E')::float renter_count,
    (tenure.data -> 'B25008_003M')::float renter_count_moe,
    case
      when (tenure.data -> 'B25008_001E')::float = 0 then 0
      else round(
        (tenure.data -> 'B25008_003E')::float / (tenure.data -> 'B25008_001E')::float * 1000
      ) / 10
    end renter_rate,
    case
      when (tenure.data -> 'B25008_001E')::float = 0 then 0
      else round(
        (tenure.data -> 'B25008_003M')::float / (tenure.data -> 'B25008_001E')::float * 1000
      ) / 10
    end renter_rate_moe,
    case
      when (poverty.data -> 'B17010_001E')::float = 0 then 0
      else round(
        (poverty.data -> 'B17010_002E')::float / (poverty.data -> 'B17010_001E')::float * 1000
      ) / 10
    end poverty_rate,
    case
      when (poverty.data -> 'B17010_001E')::float = 0 then 0
      else round(
        (poverty.data -> 'B17010_002M')::float / (poverty.data -> 'B17010_001E')::float * 1000
      ) / 10
    end poverty_rate_moe,
    p2.total pop,
    round(p2.hispanic_latino / p2.total * 1000) / 10 pct_hl,
    round(p2.white / p2.total * 1000) / 10 pct_wh,
    round(p2.black / p2.total * 1000) / 10 pct_bl,
    round(p2.american_indian / p2.total * 1000) / 10 pct_ai,
    round(p2.asian / p2.total * 1000) / 10 pct_as,
    round(p2.pacific_islander / p2.total * 1000) / 10 pct_pi,
    round(p2.other / p2.total * 1000) / 10 pct_other,
    round(p2.multi / p2.total * 1000) / 10 pct_multi

    -- round((race.data -> 'P1_003N')::float / (race.data -> 'P1_001N')::float * 1000) / 10 pct_wh,
    -- round((race.data -> 'P1_004N')::float / (race.data -> 'P1_001N')::float * 1000) / 10 pct_bl,
    -- round((race.data -> 'P1_005N')::float / (race.data -> 'P1_001N')::float * 1000) / 10 pct_ai,
    -- round((race.data -> 'P1_006N')::float / (race.data -> 'P1_001N')::float * 1000) / 10 pct_as,
    -- round((race.data -> 'P1_007N')::float / (race.data -> 'P1_001N')::float * 1000) / 10 pct_pi,
    -- round(((race.data -> 'P1_008N')::float / (race.data -> 'P1_001N')::float) * 1000) / 10 pct_other,
    -- round(((race.data -> 'P1_009N')::float / (race.data -> 'P1_001N')::float) * 1000) / 10 pct_multi
  from (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data where code = 'B25008' and year = '2022'
  ) tenure
  join (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data where code = 'B17010' and year = '2022'
  ) poverty
  on tenure.block_group = poverty.block_group and tenure.tract = poverty.tract
  join p2_race p2
  -- join (
  --   select tract, block_group, (data #>> '{}')::jsonb data
  --   from census_data where code = 'P1' and year = '2020'
  -- ) race
  on tenure.block_group = p2.block_group and tenure.tract = p2.tract
  where (tenure.data -> 'B25008_001E')::float > 0
),
filing_months as (
  select distinct date_trunc('month', filing_date) filing_month
  from eviction_cases
  order by filing_month
),
block_group_filing_counts as (
  select
    bgfm.*,
    -- compute the number of input rows where
    -- ec.defendant_address is not null
    count(ec.defendant_address) n_filings
  from (
    select
      m.filing_month,
      bg.tract_ce,
      bg.block_group_ce,
      bg.shape
    from filing_months              m
    cross join census_block_groups  bg
    where bg.county_fp = '025' -- Dane County
  ) bgfm
  left outer join eviction_cases ec
  on
    st_contains(bgfm.shape, ec.defendant_address_point) and
    bgfm.filing_month = date_trunc('month', ec.filing_date)
  group by filing_month, tract_ce, block_group_ce, shape
),
block_group_filing_rates as (
  select
    bgfc.*,
    case
      when bgd.renter_count = 0 then 0
      else round(bgfc.n_filings / bgd.renter_count * 1000) / 10
    end filing_rate
  from block_group_filing_counts  bgfc
  join block_group_demographics   bgd
    on bgfc.tract_ce = bgd.tract and bgfc.block_group_ce = bgd.block_group
)
select jsonb_build_object(
  'type', 'FeatureCollection',
  'features', jsonb_agg(f.feature)
)
from (
  select jsonb_build_object(
    'type', 'Feature',
    'id', props.region_id,
    'geometry', st_asgeojson(st_simplifypreservetopology(props.shape, 0.0001))::jsonb,
    'properties', jsonb_build_object(
      'id', props.region_id,
      'tr', props.tract,
      'bg', props.block_group::text,
      'filings', props.filings,
      'rc', props.renter_count,
      'rcm', props.renter_count_moe,
      'rr', props.renter_rate,
      'rrm', props.renter_rate_moe,
      'pr', props.poverty_rate,
      'prm', props.poverty_rate_moe,
      'pop', props.pop,
      'pct_hl', props.pct_hl,
      'pct_wh', props.pct_wh,
      'pct_bl', props.pct_bl,
      'pct_ai', props.pct_ai,
      'pct_as', props.pct_as,
      'pct_pi', props.pct_pi,
      'pct_other', props.pct_other,
      'pct_multi', props.pct_multi
    )
  ) feature
  from (
    select
      trim(leading '0' from bgd.tract::text || bgd.block_group::text) region_id,
      bge.filings,
      bge.shape,
      bgd.*
    from (
      select
        bgfc.shape,
        bgfc.tract_ce,
        bgfc.block_group_ce,
        jsonb_object_agg(
          extract(year from bgfc.filing_month)::text ||
          '-' ||
          extract(month from bgfc.filing_month)::text,
          jsonb_build_object(
            'c', bgfc.n_filings,
            'r', bgfr.filing_rate
          )
        ) filings
      from block_group_filing_counts  bgfc
      join block_group_filing_rates   bgfr
        on bgfc.tract_ce = bgfr.tract_ce and bgfc.block_group_ce = bgfr.block_group_ce
      group by bgfc.shape, bgfc.tract_ce, bgfc.block_group_ce
    ) bge
    join block_group_demographics bgd
      on bge.tract_ce = bgd.tract and bge.block_group_ce = bgd.block_group
  ) props
) f;