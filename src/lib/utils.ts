export function groupByBroadcastCompany(mediaItems: any[]) {
    const grouped: { [key: string]: any[] } = {};
    mediaItems.forEach(item => {
        const company = item.broadcast_company || 'Unknown';
        if (!grouped[company]) {
            grouped[company] = [];
        }
        grouped[company].push(item);
    });
    return grouped;
}