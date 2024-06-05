with block_group_demographics as (
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
    jsonb_build_object(
      'pct_wh', round((race.data -> 'P1_003N')::float / (race.data -> 'P1_001N')::float * 1000) / 10,
      'pct_bl', round((race.data -> 'P1_004N')::float / (race.data -> 'P1_001N')::float * 1000) / 10,
      'pct_ai', round((race.data -> 'P1_005N')::float / (race.data -> 'P1_001N')::float * 1000) / 10,
      'pct_as', round((race.data -> 'P1_006N')::float / (race.data -> 'P1_001N')::float * 1000) / 10,
      'pct_pi', round((race.data -> 'P1_007N')::float / (race.data -> 'P1_001N')::float * 1000) / 10,
      'pct_other', round(((race.data -> 'P1_008N')::float / (race.data -> 'P1_001N')::float) * 1000) / 10,
      'pct_multi', round(((race.data -> 'P1_009N')::float / (race.data -> 'P1_001N')::float) * 1000) / 10
    ) race
  from (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data where code = 'B25008' and year = '2022'
  ) tenure
  join (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data where code = 'B17010' and year = '2022'
  ) poverty
  on tenure.block_group = poverty.block_group and tenure.tract = poverty.tract
  join (
    select tract, block_group, (data #>> '{}')::jsonb data
    from census_data where code = 'P1' and year = '2020'
  ) race
  on tenure.block_group = race.block_group and tenure.tract = race.tract
  where (tenure.data -> 'B25008_001E')::float > 0
)
select jsonb_build_object(
  'type', 'FeatureCollection',
  'features', jsonb_agg(f.demographics_feature)
)
from (
  select
    jsonb_build_object(
      'type', 'Feature',
      'id', props.region_id,
      'geometry', ST_AsGeoJSON(ST_SimplifyPreserveTopology(props.shape, 0.0001))::jsonb,
      'properties', jsonb_build_object(
        'id', props.region_id,
        'region', 'Block Group',
        'rc', props.renter_count,
        'rcm', props.renter_count_moe,
        'rr', props.renter_rate,
        'rrm', props.renter_rate_moe,
        'pr', props.poverty_rate,
        'prm', props.poverty_rate_moe,
        'race', props.race
      )
    ) demographics_feature
  from (
    select
      bgd.*,
      bg.*,
      trim(leading '0' from tract_ce || block_group_ce) region_id
    from block_group_demographics bgd
    join census_block_groups      bg
      on bg.block_group_ce = bgd.block_group and bg.tract_ce = bgd.tract
  ) props
) f;
