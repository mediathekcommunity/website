// $lib/utils.js
export function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString('de-DE', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}
