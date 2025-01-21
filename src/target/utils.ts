export const calculateDecimalScore = (x: number, y: number) => {
	// Scoring ring radii in mm (approximate values for 10m air pistol target)
	const ringRadii = [
        0.8, 1.6, 2.4, 3.2, 4, 4.8, 5.6, 6.4, 7.2, 8, 8.8, 9.6, 10.4, 11.2, 12, 12.8, 13.6, 14.4, 15.2, 16, 16.8, 17.6,
        18.4, 19.2, 20, 20.8, 21.6, 22.4, 23.2, 24, 24.8, 25.6, 26.4, 27.2, 28, 28.8, 29.6, 30.4, 31.2, 32, 32.8, 33.6,
        34.4, 35.2, 36, 36.8, 37.6, 38.4, 39.2, 40, 40.8, 41.6, 42.4, 43.2, 44, 44.8, 45.6, 46.4, 47.2, 48, 48.8, 49.6,
        50.4, 51.2, 52, 52.8, 53.6, 54.4, 55.2, 56, 56.8, 57.6, 58.4, 59.2, 60, 60.8, 61.6, 62.4, 63.2, 64, 64.8, 65.6,
        66.4, 67.2, 68, 68.8, 69.6, 70.4, 71.2, 72, 72.8, 73.6, 74.4, 75.2, 76, 76.8, 77.6, 78.4, 79.2, 80,
    ];

	// Calculate radial distance (r) from the center
	const r = Math.sqrt(x ** 2 + y ** 2);

	// Find the corresponding score
	for (let i = 0; i < ringRadii.length; i++) {
		if (r <= ringRadii[i]) {
			return (10.9 - i * 0.1).toFixed(1); // Return the score
		}
	}

	// If the radial distance exceeds all ring boundaries, return 0
	return 0.0;
}
