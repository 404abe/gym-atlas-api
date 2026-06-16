const findPlaceId = async (name, lat, lng) => {
	try {
		const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
				'X-Goog-FieldMask': 'places.id,places.location',
			},
			body: JSON.stringify({ textQuery: `${name} gym` }),
		});
		const data = await response.json();
		return data.places?.[0]?.id ?? null;
	} catch (err) {
		console.error('placesService.findPlaceId error:', err.message);
		return null;
	}
};

const fetchPlaceHours = async (placeId) => {
	try {
		const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
			headers: {
				'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
				'X-Goog-FieldMask': 'regularOpeningHours',
			},
		});
		const data = await response.json();
		return data.regularOpeningHours ?? null;
	} catch (err) {
		console.error('placesService.fetchPlaceHours error:', err.message);
		return null;
	}
};

module.exports = { findPlaceId, fetchPlaceHours };
