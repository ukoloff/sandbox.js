export const pages = `
  select
      _IDRRef as id,
      _ParentIDRRef as up,
      _Code as kod,
      _Description as title,
      DATEADD(YYYY, -2000, _Fld9226) as mdate,
      _Fld9227RRef as space_id,
      _Fld9306 as lat,
      _Fld9228 as md
  from
      _Reference9221
  where _Marked = 0x00
`
export const attachments = `
  select
      _IDRRef as id,
      _Description as basename,
      _Fld9235RRef as page_id,
      DATEADD(YYYY, -2000, _Fld9237) as mdate,
      DATEADD(YYYY, -2000, _Fld9238) as cdate,
      _Fld9245 as filepath,
      _Fld9246 as bytes,
      _Fld9247 as ext
  from
      _Reference9222
`

export const spaces = `
  select
      _IDRRef as id,
      _ParentIDRRef as up,
      _Code as kod,
      _Description as name,
      _Fld10772 as handle
  from
      _Reference174X1
`

export function pagez($) {
  `
  select
      *
  from
      pages
  where
      space_id in(
          select
              id
          from
              spaces
          where
              handle = '${$.space}'
      )
`}
