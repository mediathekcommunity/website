function getqualityicon(quality) {
    if (quality === '4k') {
        return 'mdi:uhd';
    } else if (quality === '1080p' || quality === 'fhd') {
        return 'material-symbols:full-hd';
    } else if (quality === 'hd') {
        return 'mdi:video';
    } else {
        return 'mdi:video-outline';
    }
};

function getImageUrl(slide) {
    console.log('slide:', slide);

    let imageUrl = '';
    switch (true) {
        case !!slide.backdrop:
            imageUrl = 'https://mediathekc.b-cdn.net/t/p/original' + slide.backdrop;
            break;
        case !!slide.backdropup:
            imageUrl =
                'https://api2.mediathek.community/api/files/pbc_772122303/sjyo8dgc5h51h63/' +
                slide.backdropup;
            break;
        case !!slide.poster:
            imageUrl = 'https://mediathekc.b-cdn.net/t/p/original' + slide.poster;
            break;
        case !!slide.posterup:
            imageUrl =
                'https://api2.mediathek.community/api/files/pbc_772122303/sjyo8dgc5h51h63/' +
                slide.posterup;
            break;
        default:
            console.warn('No backdrop found for slide', slide);
            imageUrl = 'https://api.mediathek.community/assets/default-backdrop.jpg';
    }
    console.log('imageUrl:', imageUrl);
    return imageUrl;
};

function getformat(id) {
    switch (id) {
        case 'mpd':
            return 'application/dash+xml';
        case 'm3u8':
            return 'application/x-mpegURL';
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'avi':
            return 'video/x-msvideo';
        default:
            return 'application/dash+xml';
    }
}
function getTypeIcon(type) {
    switch (type) {
        case 'movie':
            return 'mdi:movie';
        case 'series':
            return 'mdi:tv';
        case 'music':
            return 'mdi:music';
        default:
            return 'mdi:movie';
    }
};
export { getqualityicon, getImageUrl, getformat, getTypeIcon };
// This file contains utility functions for handling details in a media application.