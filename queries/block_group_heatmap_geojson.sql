with bg as (
  select * from census_block_groups where county_fp = '025'
),
filing as (
  select
    count(ec.defendant_address_point),
    ec.defendant_address_point,
    EXTRACT(YEAR FROM ec.filing_date) y,
    EXTRACT(MONTH FROM ec.filing_date) m,
    EXTRACT(EPOCH FROM DATE_TRUNC('month', ec.filing_date)) epoch
  from eviction_cases ec
  join bg
  on st_contains(bg.shape, ec.defendant_address_point)
  where defendant_address_point is not null
  group by ec.defendant_address_point, y, m, epoch
),
dap as (
  select
    defendant_address_point,
    row_number() over(
      order by defendant_address_point
    )
  from (
    select distinct defendant_address_point
    from eviction_cases
    where defendant_address_point is not null
  ) t
),
features as (
  select jsonb_build_object(
    'type', 'Feature',
    'id', props.place_id,
    'geometry', ST_AsGeoJSON(defendant_address_point)::jsonb,
    'properties', jsonb_build_object(
      'c', props.count,
      'e', props.epoch
    )
  ) feature
  from (
    select
      filing.*,
      dap.row_number::text || '-' || filing.y::text || '-' || filing.m::text place_id
    from filing
    join bg
      on st_contains(bg.shape, filing.defendant_address_point)
    join dap
      on dap.defendant_address_point = filing.defendant_address_point
  ) props
)
select jsonb_build_object(
  'type', 'FeatureCollection',
  'features', jsonb_agg(features.feature)
)
from features;