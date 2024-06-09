
with bg as (
  select * from census_block_groups where county_fp = '025'
),
filing as (
  select
    count(1) c,
    ec.defendant_address_point,
    EXTRACT(YEAR FROM ec.filing_date) AS y,
    EXTRACT(MONTH FROM ec.filing_date) AS m
  from eviction_cases ec
  join bg
  on st_contains(bg.shape, ec.defendant_address_point)
  where defendant_address_point is not null
  group by ec.defendant_address_point, y, m
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
    'properties', to_jsonb(props.*) - 'defendant_address_point' - 'place_id'
  ) feature
  from (
    select
      filing.*,
      dap.row_number::text || '_' || filing.m::text || '_' || filing.y::text  place_id
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
