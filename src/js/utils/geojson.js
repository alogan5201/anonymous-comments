export const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        title: 'Mapbox DC',
        description: '1714 14th St NW, Washington DC',
        'marker-color': '#35A2D1',
        'marker-size': 'large',
        'marker-symbol': '1',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        title: 'Mapbox SF',
        description: '155 9th St, San Francisco',
        'marker-color': '#fc4353',
        'marker-size': 'large',
        'marker-symbol': '2',
      },
    },
  ],
}
