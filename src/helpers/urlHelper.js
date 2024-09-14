const UrlHttpsChecker = (url) => {
	let pattern = new RegExp('^https:\\/\\/', 'i');

	return !!pattern.test(url);
};

function removeHttpAndHttps(url) {
	// Remove "http://" if present
	url = url?.replace(/^https?:\/\//i, '');

	return url;
}
const YoutubeUrlVedioIdHelper = (url) => {
	// const pattern1 = /youtube\.com.*(\?v=|\/embed\/)(.{11})/;
	// const pattern2 = /youtu.be\/(.{11})/;
	// // let videoid = url.match(pattern);
	// // if (videoid && videoid[1]) {
	// // 	return videoid[1];
	// // } else {
	// // 	return null;
	// // }
	var regex =
		/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([^&?]+)/;

	var match = regex.exec(url);

	if (match && match[1]) {
		return match[1];
	} else {
		return null;
	}
};

const UrlArrayChecker = (arr) => {
	let pattern = new RegExp('^https:\\/\\/', 'i');

	if (arr?.length) {
		arr?.forEach((item) => {
			if (item?.url && !pattern.test(item?.url)) {
				item.url = 'https://' + item?.url;
			}
		});
		return arr;
	}
};

export {
	UrlHttpsChecker,
	UrlArrayChecker,
	YoutubeUrlVedioIdHelper,
	removeHttpAndHttps,
};
