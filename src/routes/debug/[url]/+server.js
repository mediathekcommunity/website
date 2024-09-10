// @ts-nocheck
import youtubedl from 'youtube-dl-exec';
import { page } from '$app/stores';

async function downloadVideo(event) {
	var t;
	t = await youtubedl(
		event,
		{
			dumpSingleJson: true,
			noCheckCertificates: true,
			noWarnings: true,
			preferFreeFormats: true
		}
	);
	return JSON.stringify(t);
}
export async function GET({ url }) {
	var x = url.searchParams.get('url1');
  var t = await downloadVideo(x);
	return new Response(t, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
