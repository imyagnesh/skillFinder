export default function starRatingCompile(element, attrs) {
    if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
        attrs.maxRating = '5';
    }
}
